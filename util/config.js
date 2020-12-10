import fs from 'fs';
import YAML from 'yaml';

const file = fs.readFileSync('./config.yaml', 'utf8');

export const {
  webhook, skus, delay_time: delayTime, zip_code: zipCode,
} = YAML.parse(file);
