import { VariableNotFound } from '../../exceptions';
import generalOptionalVariables from './optionalVariables';
import generalRequiredVariables from './requiredVariables';

const getEnv = (
  requiredVariables: string[] = generalRequiredVariables,
  optionalVariables: any = generalOptionalVariables,
) => {
    Object.keys(optionalVariables)
      .forEach((variable) => {
          const value = process.env[variable];
          if (!value) {
              process.nextTick(() => {
                  // Require on the next tick queue because it changes process.env
                  // which will be needed by 'debug' while assigning namespaces
                  const { warningLogger } = require('../../loggers');
                  warningLogger(
                    `${variable} was not found in env, defaulting to ${optionalVariables[variable]} .`,
                  );
              });
              process.env[variable] = optionalVariables[variable];
          }
      });

    requiredVariables.forEach((variable) => {
        if (!process.env[variable]) {
            throw new VariableNotFound(variable);
        }
    });
    return { ...process.env };
};

export default getEnv;
