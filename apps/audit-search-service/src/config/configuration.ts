export default () => ({
  port: parseInt(process.env.PORT || '3005', 10),
  elasticNode: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
});
