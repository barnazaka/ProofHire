import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  getSchoolData(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, string];
  getSkillsData(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, string];
  getExperienceData(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, string];
}

export type ImpureCircuits<PS> = {
  publishCV(context: __compactRuntime.CircuitContext<PS>, name_0: string): __compactRuntime.CircuitResults<PS, []>;
  proveSchool(context: __compactRuntime.CircuitContext<PS>,
              commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  proveSkills(context: __compactRuntime.CircuitContext<PS>,
              commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  proveExperience(context: __compactRuntime.CircuitContext<PS>,
                  commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  hireCandidate(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  publishCV(context: __compactRuntime.CircuitContext<PS>, name_0: string): __compactRuntime.CircuitResults<PS, []>;
  proveSchool(context: __compactRuntime.CircuitContext<PS>,
              commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  proveSkills(context: __compactRuntime.CircuitContext<PS>,
              commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  proveExperience(context: __compactRuntime.CircuitContext<PS>,
                  commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  hireCandidate(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  publishCV(context: __compactRuntime.CircuitContext<PS>, name_0: string): __compactRuntime.CircuitResults<PS, []>;
  proveSchool(context: __compactRuntime.CircuitContext<PS>,
              commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  proveSkills(context: __compactRuntime.CircuitContext<PS>,
              commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  proveExperience(context: __compactRuntime.CircuitContext<PS>,
                  commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  hireCandidate(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly talentName: string;
  readonly schoolProofCommitment: Uint8Array;
  readonly skillsProofCommitment: Uint8Array;
  readonly experienceProofCommitment: Uint8Array;
  readonly isHired: boolean;
  readonly cvLive: boolean;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
