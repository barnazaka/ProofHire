import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  registerUser(context: __compactRuntime.CircuitContext<PS>,
               userAddr_0: string,
               identityCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  submitProof(context: __compactRuntime.CircuitContext<PS>,
              userAddr_0: string,
              proofHash_0: Uint8Array,
              claimType_0: string,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyProof(context: __compactRuntime.CircuitContext<PS>, pHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type ProvableCircuits<PS> = {
  registerUser(context: __compactRuntime.CircuitContext<PS>,
               userAddr_0: string,
               identityCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  submitProof(context: __compactRuntime.CircuitContext<PS>,
              userAddr_0: string,
              proofHash_0: Uint8Array,
              claimType_0: string,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyProof(context: __compactRuntime.CircuitContext<PS>, pHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type PureCircuits = {
  grantAccess(recipient_0: string): [];
  clearProfile(): [];
}

export type Circuits<PS> = {
  registerUser(context: __compactRuntime.CircuitContext<PS>,
               userAddr_0: string,
               identityCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  submitProof(context: __compactRuntime.CircuitContext<PS>,
              userAddr_0: string,
              proofHash_0: Uint8Array,
              claimType_0: string,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyProof(context: __compactRuntime.CircuitContext<PS>, pHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  grantAccess(context: __compactRuntime.CircuitContext<PS>, recipient_0: string): __compactRuntime.CircuitResults<PS, []>;
  clearProfile(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly user_addr: string;
  readonly user_commitment: Uint8Array;
  readonly proof_hash: Uint8Array;
  readonly proof_type: string;
  readonly proof_timestamp: bigint;
  readonly proof_owner: string;
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
