const configDir = '/home/goran/code/butler/src/config/';
console.log(`b1 ${configDir}`);

process.env.NODE_CONFIG_DIR = configDir;
process.env.NODE_ENV = 'production';
process.env.SUPPRESS_NO_CONFIG_WARNING = 'false';

export const { NODE_CONFIG_DIR } = process.env;
export const { SUPPRESS_NO_CONFIG_WARNING } = process.env;
export const { NODE_ENV } = process.env;