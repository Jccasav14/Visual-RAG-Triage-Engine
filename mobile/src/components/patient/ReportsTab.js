import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {
  FileSpreadsheet,
  Camera,
  RefreshCw,
  Download,
  Award,
  X,
  ShieldCheck,
  Sparkles,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { formatWoundClass, getClinicalBadge } from '../../utils/clinicalUtils';

export const ReportsTab = ({
  user,
  dailyReports,
  loadingReports,
  onRefresh,
  onGoToEvaluation,
}) => {
  const { theme } = useTheme();
  const [selectedReportDetail, setSelectedReportDetail] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // GENERADOR RESILIENTE DE PDF EN ESPAÑOL
  const handleExportPDF = async (report) => {
    if (!report) return;
    setGeneratingPdf(true);
    try {
      const safeImages = Array.isArray(report.imageUris)
        ? report.imageUris.filter((img) => typeof img === 'string' && img.trim().length > 0)
        : [];

      const buildHtml = (includeImages = true) => {
        let photosHtml = '';
        if (includeImages && safeImages.length > 0) {
          photosHtml = safeImages
            .map((src, idx) => {
              const cleanSrc = src.startsWith('data:') || src.startsWith('http') || src.startsWith('file:')
                ? src
                : `data:image/jpeg;base64,${src}`;
              return `
                <div style="display:inline-block; width:45%; margin:6px 2%; text-align:center; vertical-align:top;">
                  <img src="${cleanSrc}" style="width:100%; height:140px; object-fit:cover; border-radius:6px; border:1px solid #cbd5e1; display:block; margin:0 auto;" />
                  <div style="font-size:10px; color:#64748b; text-align:center; margin-top:4px; font-weight:bold;">Perspectiva #${idx + 1}</div>
                </div>`;
            })
            .join('');
        }

        const badge = getClinicalBadge(report.severity, report.classification);

        return `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              @page { size: A4; margin: 12mm; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 12px; background: #ffffff; }
              .header { border-bottom: 2px solid #0d9488; padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
              .clinic-title { font-size: 18px; font-weight: 800; color: #0d9488; margin: 0; }
              .clinic-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
              .folio-box { text-align: right; }
              .folio-num { font-size: 13px; font-weight: 800; color: #0d9488; }
              .folio-date { font-size: 10px; color: #64748b; margin-top: 2px; }
              .section-title { font-size: 11px; font-weight: 800; color: #0d9488; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 12px; margin-bottom: 6px; }
              .info-grid { display: flex; flex-wrap: wrap; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0; padding: 8px 10px; }
              .info-cell { width: 50%; padding: 4px 6px; box-sizing: border-box; }
              .info-label { font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase; }
              .info-val { font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 2px; }
              .diag-card { background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 6px; padding: 8px 10px; margin-top: 6px; }
              .diag-title { font-size: 13px; font-weight: 800; color: #0f766e; }
              .diag-meta { font-size: 11px; color: #115e59; margin-top: 2px; font-weight: 600; }
              .images-wrap { text-align: center; margin-top: 6px; }
              .plan-box { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; font-size: 11px; line-height: 1.5; color: #334155; margin-top: 6px; white-space: pre-wrap; }
              .footer { margin-top: 20px; padding-top: 8px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
              .footer-left { font-size: 10px; color: #0d9488; font-weight: 700; }
              .footer-right { font-size: 9px; color: #94a3b8; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h1 class="clinic-title">HOSPITAL DIGITAL • VISUAL RAG</h1>
                <div class="clinic-sub">Sistema Inteligente de Seguimiento Postquirúrgico</div>
              </div>
              <div class="folio-box">
                <div class="folio-num">FOLIO: ${report.id || 'N/A'}</div>
                <div class="folio-date">${report.date || ''} • ${report.time || ''}</div>
              </div>
            </div>

            <div class="section-title">Información del Paciente y Procedimiento</div>
            <div class="info-grid">
              <div class="info-cell">
                <div class="info-label">Paciente</div>
                <div class="info-val">${user?.fullName || user?.email || 'Paciente Registrado'}</div>
              </div>
              <div class="info-cell">
                <div class="info-label">Cédula / DNI</div>
                <div class="info-val">${user?.cedula || 'Registrado en ficha'}</div>
              </div>
              <div class="info-cell">
                <div class="info-label">Cirugía Registrada</div>
                <div class="info-val">${report.surgeryType || 'Postoperatorio General'}</div>
              </div>
              <div class="info-cell">
                <div class="info-label">Cronograma</div>
                <div class="info-val">Día ${report.recoveryDay || 1} de reposo</div>
              </div>
            </div>

            <div class="section-title">Evaluación de la Incisión Quirúrgica</div>
            <div class="diag-card">
              <div class="diag-title">${formatWoundClass(report.classification)}</div>
              <div class="diag-meta">
                Estado: ${badge.text} • ${safeImages.length || 1} perspectiva(s) evaluada(s)
              </div>
            </div>

            ${photosHtml ? `<div class="section-title">Fotografías Evaluadas</div><div class="images-wrap">${photosHtml}</div>` : ''}

            <div class="section-title">Síntomas Reportados por el Paciente</div>
            <div style="font-size:11px; color:#475569; background:#f8fafc; padding:8px 10px; border-radius:6px; border:1px solid #e2e8f0; margin-top:4px;">
              ${report.symptoms || 'Sin molestias particulares referidas.'}
            </div>

            <div class="section-title">Indicaciones Médicas y Sugerencias de Cuidado</div>
            <div class="plan-box">${report.plan || 'Continuar con el régimen médico establecido por su cirujano tratante.'}</div>

            <div class="footer">
              <div class="footer-left">Documento Clínico Digital Verificado • Visual RAG Postop</div>
              <div class="footer-right">Generado electrónicamente</div>
            </div>
          </body>
          </html>
        `;
      };

      let htmlContent = buildHtml(true);
      let pdfResult;
      try {