import type { PickleStepArgument } from '@cucumber/messages';
import { requirePlaywrightBddModule } from './playwrightBddPaths';

export const patchStepInvoker = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { BddStepInvoker } = requirePlaywrightBddModule<{ BddStepInvoker: any }>(
    'dist',
    'runtime',
    'bddStepInvoker.js',
  );

  const originalInvoke = BddStepInvoker.prototype.invoke;

  BddStepInvoker.prototype.invoke = async function (
    stepText: string,
    argument: PickleStepArgument | null,
    providedFixtures: Record<string, unknown>,
  ) {
    this.bddContext.stepIndex++;
    this.bddContext.step.title = stepText;

    const stepTextWithKeyword = this.getBddStepData().textWithKeyword;
    const matchedDefinition = this.findStepDefinition(stepText, stepTextWithKeyword);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { getLocationInFile } = requirePlaywrightBddModule<{
      getLocationInFile: (file: string) => { line: number; column: number };
    }>('dist', 'playwright', 'getLocationInFile.js');
    const location = getLocationInFile(this.bddContext.testInfo.file);

    const stepParameters = await this.getStepParameters(
      matchedDefinition,
      stepText,
      argument ?? undefined,
    );

    const stepHookFixtures = this.getStepHookFixtures(providedFixtures ?? {});
    const stepFixtures = this.getStepFixtures(providedFixtures ?? {});

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { runStepWithLocation } = requirePlaywrightBddModule<{
      runStepWithLocation: (
        test: unknown,
        stepTitle: string,
        location: { line: number; column: number },
        run: () => Promise<unknown>,
      ) => Promise<unknown>;
    }>('dist', 'playwright', 'runStepWithLocation.js');

    return runStepWithLocation(this.bddContext.test, stepTextWithKeyword, location, async () => {
      await this.runBeforeStepHooks(stepHookFixtures);
      const result = await matchedDefinition.definition.fn.call(
        this.world,
        stepFixtures,
        ...stepParameters,
      );
      await this.runAfterStepHooks(stepHookFixtures);
      return result;
    });
  };

  return originalInvoke;
};
