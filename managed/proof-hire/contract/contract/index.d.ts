import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  submitProof(context: __compactRuntime.CircuitContext<PS>,
              user_0: Uint8Array,
              proof_0: Uint8Array,
              cType_0: string): __compactRuntime.CircuitResults<PS, []>;
  verifyCandidateClaim(context: __compactRuntime.CircuitContext<PS>,
                       pHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type ProvableCircuits<PS> = {
  submitProof(context: __compactRuntime.CircuitContext<PS>,
              user_0: Uint8Array,
              proof_0: Uint8Array,
              cType_0: string): __compactRuntime.CircuitResults<PS, []>;
  verifyCandidateClaim(context: __compactRuntime.CircuitContext<PS>,
                       pHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  submitProof(context: __compactRuntime.CircuitContext<PS>,
              user_0: Uint8Array,
              proof_0: Uint8Array,
              cType_0: string): __compactRuntime.CircuitResults<PS, []>;
  verifyCandidateClaim(context: __compactRuntime.CircuitContext<PS>,
                       pHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type Ledger = {
  readonly user_addr: Uint8Array;
  readonly proof_hash: Uint8Array;
  readonly claim_type: string;
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
