import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum CVStatus { DRAFT = 0, LIVE = 1 }

export type Witnesses<PS> = {
  getSchoolCredential(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  getSkillsCredential(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  getExperienceCredential(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  getEmailCredential(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  getYoECredential(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  localSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  submitSchoolProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitSkillsProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitExperienceProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitEmailProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitYoEProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  saveCV(context: __compactRuntime.CircuitContext<PS>, name_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  clearProfile(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  submitSchoolProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitSkillsProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitExperienceProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitEmailProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitYoEProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  saveCV(context: __compactRuntime.CircuitContext<PS>, name_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  clearProfile(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  hireCandidate(): [];
}

export type Circuits<PS> = {
  submitSchoolProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitSkillsProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitExperienceProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitEmailProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitYoEProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  saveCV(context: __compactRuntime.CircuitContext<PS>, name_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  hireCandidate(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  clearProfile(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly talentName: Uint8Array;
  readonly proofSchool: Uint8Array;
  readonly proofSkills: Uint8Array;
  readonly proofExperience: Uint8Array;
  readonly proofEmail: Uint8Array;
  readonly proofYoE: Uint8Array;
  readonly cvStatus: CVStatus;
  readonly cvOwner: Uint8Array;
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
