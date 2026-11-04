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
        pdfResult = await Print.printToFileAsync({ html: htmlContent });
      } catch {
        htmlContent = buildHtml(false);
        pdfResult = await Print.printToFileAsync({ html: htmlContent });
      }

      const pdfUri = pdfResult?.uri;
      let sharedSuccessfully = false;
      try {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare && pdfUri) {
          await Sharing.shareAsync(pdfUri, {
            UTI: '.pdf',
            mimeType: 'application/pdf',
            dialogTitle: `Guardar o Compartir Reporte ${report.id || 'Postoperatorio'}`,
          });
          sharedSuccessfully = true;
        }
      } catch {
        // Fallback al diálogo nativo de impresión
      }

      if (!sharedSuccessfully) {
        await Print.printAsync({ html: htmlContent });
      }
    } catch {
      Alert.alert('Error', 'No se pudo generar el reporte PDF. Por favor intenta nuevamente.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={[styles.sectionHeading, { color: theme.text }]}>Reportes Clínicos Guardados</Text>
        <TouchableOpacity onPress={onRefresh} style={{ padding: 6 }}>
          <RefreshCw size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {loadingReports ? (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : dailyReports.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.emptyIconCircle, { backgroundColor: theme.primaryBg }]}>
            <FileSpreadsheet size={36} color={theme.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Sin Reportes Registrados</Text>
          <Text style={[styles.emptySub, { color: theme.textMuted }]}>
            Toma fotos de tu incisión para emitir tu primer reporte clínico en PDF.
          </Text>
          <TouchableOpacity
            style={[styles.emptyActionBtn, { backgroundColor: theme.primary }]}
            onPress={onGoToEvaluation}
          >
            <Camera size={18} color="#FFFFFF" />
            <Text style={styles.emptyActionBtnText}>Realizar Evaluación</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {dailyReports.map((report) => {
            const badge = getClinicalBadge(report.severity, report.classification);
            const cleanClass = formatWoundClass(report.classification);

            return (
              <View
                key={report.id}
                style={[styles.reportCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.cardHeaderTop}>
                      <Text style={[styles.folioText, { color: theme.primary }]}>{report.id}</Text>
                      <View style={[styles.badgePill, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
                      </View>
                    </View>

                    <Text style={[styles.classTitle, { color: theme.text }]}>{cleanClass}</Text>
                    <Text style={[styles.dateText, { color: theme.textMuted }]}>
                      Día {report.recoveryDay} • {report.date} ({report.time})
                    </Text>
                  </View>
                </View>

                {/* CUERPO DEL REPORTE RESUMIDO */}
                <View style={[styles.planBox, { backgroundColor: theme.cardSub }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <Sparkles size={14} color={theme.primary} />
                    <Text style={[styles.planTitle, { color: theme.text }]}>Plan Médico del Día:</Text>
                  </View>
                  <Text style={[styles.planContent, { color: theme.text }]} numberOfLines={2}>
                    {report.plan}
                  </Text>
                </View>

                {/* BOTONES LIMPIOS 50% / 50% */}
                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    style={[styles.btnHalf, { backgroundColor: theme.primary }]}
                    onPress={() => handleExportPDF(report)}
                    disabled={generatingPdf}
                  >
                    <Download size={16} color="#FFFFFF" />
                    <Text style={styles.btnHalfText}>Descargar PDF</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btnHalfSecondary, { backgroundColor: theme.cardSub, borderColor: theme.border }]}
                    onPress={() => setSelectedReportDetail(report)}
                  >
                    <Text style={[styles.btnHalfSecondaryText, { color: theme.text }]}>Ver Detalle</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* MODAL DETALLE DE REPORTE COMPLETO */}
      <Modal visible={!!selectedReportDetail} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Award size={22} color={theme.primary} />
                <Text style={[styles.modalHeading, { color: theme.text }]}>Reporte Clínico Oficial</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedReportDetail(null)} style={{ padding: 4 }}>
                <X size={22} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            {selectedReportDetail && (
              <ScrollView style={{ maxHeight: 440 }} showsVerticalScrollIndicator={false}>
                <View style={[styles.modalCertBox, { backgroundColor: theme.cardSub }]}>
                  <Text style={[styles.folioText, { color: theme.primary }]}>FOLIO: {selectedReportDetail.id}</Text>
                  <Text style={[styles.certPatient, { color: theme.text }]}>Paciente: {user?.fullName || user?.email}</Text>
                  <Text style={[styles.dateText, { color: theme.textMuted }]}>
                    Fecha: {selectedReportDetail.date} ({selectedReportDetail.time}) • Día {selectedReportDetail.recoveryDay}
                  </Text>
                </View>

                {/* IMÁGENES EVALUADAS */}
                {Array.isArray(selectedReportDetail.imageUris) && selectedReportDetail.imageUris.length > 0 && (
                  <View style={styles.modalPhotosCenteredWrap}>
                    {selectedReportDetail.imageUris.map((imgSrc, idx) => (
                      <Image
                        key={idx}
                        source={{
                          uri: imgSrc.startsWith('data:') || imgSrc.startsWith('http') || imgSrc.startsWith('file:')
                            ? imgSrc
                            : `data:image/jpeg;base64,${imgSrc}`,
                        }}
                        style={styles.modalReportThumb}
                      />
                    ))}
                  </View>
                )}

                <View style={[styles.certSection, { borderTopColor: theme.cardSub }]}>
                  <Text style={[styles.certHeading, { color: theme.primary }]}>EVALUACIÓN DE INCISIÓN</Text>
                  <Text style={[styles.modalClassTitle, { color: theme.text }]}>
                    {formatWoundClass(selectedReportDetail.classification)}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: getClinicalBadge(selectedReportDetail.severity, selectedReportDetail.classification).dot,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: getClinicalBadge(selectedReportDetail.severity, selectedReportDetail.classification).color,
                      }}
                    >
                      Estado: {getClinicalBadge(selectedReportDetail.severity, selectedReportDetail.classification).text}
                    </Text>
                  </View>
                </View>

                <View style={[styles.certSection, { borderTopColor: theme.cardSub }]}>
                  <Text style={[styles.certHeading, { color: theme.primary }]}>SUGERENCIAS CLÍNICAS</Text>
                  <Text style={[styles.certPlanText, { color: theme.text }]}>{selectedReportDetail.plan}</Text>
                </View>

                <View style={[styles.digitalStamp, { backgroundColor: theme.primaryBg, borderColor: theme.primary }]}>
                  <ShieldCheck size={20} color={theme.primary} />
                  <Text style={[styles.digitalStampText, { color: theme.primary }]}>
                    Documento Clínico Digital Verificado • Visual RAG Postop
                  </Text>
                </View>
              </ScrollView>
            )}

            {selectedReportDetail && (
              <TouchableOpacity
                style={[styles.modalDownloadBtn, { backgroundColor: theme.primary }]}
                onPress={() => handleExportPDF(selectedReportDetail)}
                disabled={generatingPdf}
              >
                {generatingPdf ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Download size={18} color="#FFFFFF" />
                    <Text style={styles.modalDownloadBtnText}>Descargar Reporte en PDF</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 14 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  sectionHeading: { fontSize: 20, fontWeight: '800' },
  emptyCard: {
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  emptyIconCircle: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontSize: 17, fontWeight: '800', textAlign: 'center' },
  emptySub: { fontSize: 13, textAlign: 'center', marginTop: 6, maxWidth: 280, lineHeight: 18 },
  emptyActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginTop: 18 },
  emptyActionBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  reportCard: { borderRadius: 14, borderWidth: 1, padding: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  cardHeaderTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  folioText: { fontSize: 12, fontWeight: '800' },
  badgePill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  classTitle: { fontSize: 15, fontWeight: '800' },
  dateText: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  planBox: { padding: 10, borderRadius: 8, marginVertical: 8 },
  planTitle: { fontSize: 12, fontWeight: '800' },
  planContent: { fontSize: 12, lineHeight: 17 },
  buttonsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  btnHalf: { flex: 1, height: 40, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnHalfText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  btnHalfSecondary: { flex: 1, height: 40, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  btnHalfSecondaryText: { fontSize: 13, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 440, borderRadius: 16, padding: 16, elevation: 8 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  modalHeading: { fontSize: 16, fontWeight: '800' },
  modalCertBox: { padding: 10, borderRadius: 8, marginTop: 10 },
  modalPhotosCenteredWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 12,
    marginBottom: 4,
  },
  modalReportThumb: {
    width: 130,
    height: 130,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  certPatient: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  certSection: { marginTop: 10, paddingTop: 8, borderTopWidth: 1 },
  certHeading: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  modalClassTitle: { fontSize: 14, fontWeight: '800', marginTop: 2 },
  certPlanText: { fontSize: 12, lineHeight: 18, marginTop: 2 },
  digitalStamp: { marginTop: 12, padding: 10, borderRadius: 8, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  digitalStampText: { fontSize: 11, fontWeight: '700', flex: 1 },
  modalDownloadBtn: { marginTop: 14, height: 46, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  modalDownloadBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});

