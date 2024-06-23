import { KeypaConfigBuilder } from 'keypa';
import process from 'process';

async function main(): Promise<void> {
  const environments = ['development', 'production'];
  const currentEnvironment = environments[0];
  const builder = KeypaConfigBuilder.configure(environments[0], environments[1]);

  const azureConfig = {
    keyVaultName: 'kv-keypa-development',
  }

  const awsConfig = {
    profile: 'playground',
  }

  // Arrange
  builder.get(environments[0]).providers
    .set('dotenv', {})
    .set('azure-keyvault', azureConfig)
    .set('aws-secrets-manager', { ...awsConfig, secrets: `${environments[0]}/keypa/config` });

  builder.get(environments[1]).providers
    .set('dotenv', {})
    .set('azure-keyvault', azureConfig)
    .set('aws-secrets-manager', { ...awsConfig, secrets: `${environments[1]}/keypa/config` });

  const keypa = await builder.initialize(currentEnvironment);

  console.log('AZURE-KEYPA-TEST: ', keypa.get('AZURE-KEYPA-TEST').toJson());
  console.log('AWS-KEYPA-TEST: ', keypa.get('AWS_KEYPA_TEST').toJson());
}

main().catch((err) => {
  console.log("error code: ", err.code);
  console.log("error message: ", err.message);
  console.log("error stack: ", err.stack);
  process.exit(1);
});