import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum CVStatus { DRAFT = 0, LIVE = 1 }

export type Witnesses<PS> = {
  localSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  getSchoolCredential(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  getSkillsCredential(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  getExperienceCredential(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  getCertificationsCredential(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  submitSchoolProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitSkillsProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitExperienceProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitCertificationsProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  saveCV(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  verifySchoolProof(context: __compactRuntime.CircuitContext<PS>,
                    commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  verifySkillsProof(context: __compactRuntime.CircuitContext<PS>,
                    commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  verifyExperienceProof(context: __compactRuntime.CircuitContext<PS>,
                        commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  verifyCertificationsProof(context: __compactRuntime.CircuitContext<PS>,
                            commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  clearProfile(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  submitSchoolProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitSkillsProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitExperienceProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitCertificationsProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  saveCV(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  verifySchoolProof(context: __compactRuntime.CircuitContext<PS>,
                    commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  verifySkillsProof(context: __compactRuntime.CircuitContext<PS>,
                    commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  verifyExperienceProof(context: __compactRuntime.CircuitContext<PS>,
                        commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  verifyCertificationsProof(context: __compactRuntime.CircuitContext<PS>,
                            commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  clearProfile(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  submitSchoolProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitSkillsProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitExperienceProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  submitCertificationsProof(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  saveCV(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  verifySchoolProof(context: __compactRuntime.CircuitContext<PS>,
                    commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  verifySkillsProof(context: __compactRuntime.CircuitContext<PS>,
                    commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  verifyExperienceProof(context: __compactRuntime.CircuitContext<PS>,
                        commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  verifyCertificationsProof(context: __compactRuntime.CircuitContext<PS>,
                            commitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  clearProfile(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly cvOwner: Uint8Array;
  readonly proofOfSchool: Uint8Array;
  readonly proofOfSkills: Uint8Array;
  readonly proofOfExperience: Uint8Array;
  readonly proofOfCertifications: Uint8Array;
  readonly cvStatus: CVStatus;
  readonly round: bigint;
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
