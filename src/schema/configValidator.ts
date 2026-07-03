import Ajv from 'ajv'
import panel_config_schema_ajv from './panel_config.json'

export const configValidator = new Ajv().compile(panel_config_schema_ajv)
