const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.extraNodeModules = {
  '@visual-rag/ui-components': path.resolve(workspaceRoot, 'libs/shared/ui-components/src/index.ts'),
  '@visual-rag/shared-types': path.resolve(workspaceRoot, 'libs/shared/types/src/index.ts'),
  '@visual-rag/redis-contract': path.resolve(workspaceRoot, 'libs/shared/redis-contract/src/index.ts'),
  '@visual-rag/supabase': path.resolve(workspaceRoot, 'libs/shared/supabase/src/index.ts'),
};

module.exports = config;
