import { TargetConfiguration } from '@nrwl/devkit';

export interface ESBuildSetupGeneratorSchema {
  app: string;

  watch: boolean;
  decoratorHandler: 'tsc' | 'swc';

  entry?: string;
  tsconfigPath?: string;
  outputPath?: string;

  latestPackage: boolean;
}

export interface NormalizedESBuildSetupGeneratorSchema
  extends ESBuildSetupGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectSourceRoot: string;

  buildTargetConfig: TargetConfiguration;
  serveTargetConfig: TargetConfiguration;

  assets: string[];
}