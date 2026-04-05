import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  getCVData(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, { nameHash: Uint8Array
                                                                        }];
}

export type ImpureCircuits<PS> = {
  submitCV(context: __compactRuntime.CircuitContext<PS>, name_0: string): __compactRuntime.CircuitResults<PS, []>;
  verifyHash(context: __compactRuntime.CircuitContext<PS>,
             expectedHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  submitCV(context: __compactRuntime.CircuitContext<PS>, name_0: string): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  submitCV(context: __compactRuntime.CircuitContext<PS>, name_0: string): __compactRuntime.CircuitResults<PS, []>;
  verifyHash(context: __compactRuntime.CircuitContext<PS>,
             expectedHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly submissionCount: bigint;
  readonly ownerAddress: { bytes: Uint8Array };
  readonly publicName: string;
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
