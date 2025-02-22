import { Address, call } from '@massalabs/massa-as-sdk';
import { Args, NoArg, bytesToString, bytesToU64 } from '@massalabs/as-types';

/**
 * The Massa's standard SFT implementation wrapper.
 *
 * @remarks
 * This class can be used to wrap a smart contract implementing
 * Massa standard SFT.
 * All the serialization/deserialization will handled here.
 *
 * @example
 * ```typescript
 * const SFT = new SFTWrapper(SFTaddr);
 * SFT.transfer('1x', 1);
 * ```
 */
export class SFTWrapper {
  _origin: Address;

  /**
   * Wraps a smart contract exposing standard semi fungible token.
   *
   * @param at - Address of the contract
   */
  constructor(at: Address) {
    this._origin = at;
  }

  /**
   * Generate an event with the SFT's name
   */
  name(): string {
    return bytesToString(call(this._origin, 'name', NoArg, 0));
  }
  /**
   * Generate an event with the SFT's symbol
   */
  symbol(): string {
    return bytesToString(call(this._origin, 'symbol', NoArg, 0));
  }

  /**
   * generate an event with the token URI (external link written in SFT where pictures or others are stored)
   * @param tokenId - Token ID
   */
  tokenURI(tokenId: u64): string {
    return bytesToString(
      call(this._origin, 'tokenURI', new Args().add(tokenId), 0),
    );
  }

  /**
   * generate an event with the base URI (external link written in SFT where pictures or others a stored)
   */
  baseURI(): string {
    return bytesToString(call(this._origin, 'baseURI', NoArg, 0));
  }

  /**
   * Generate an event with  the max supply
   */
  totalSupply(): u64 {
    return bytesToU64(call(this._origin, 'totalSupply', NoArg, 0));
  }

  /**
   * Generate an event with the current counter, if 10 SFT minted, returns 10.
   */
  currentSupply(): u64 {
    return bytesToU64(call(this._origin, 'currentSupply', NoArg, 0));
  }

  /**
   * The addressTo becomes the owner of the next token (if current tokenID = 10, will mint 11 )
   * Check if max supply is not reached
   *
   * @param addressTo - address that will receive the minted token
   */
  mint(addressTo: string): void {
    call(this._origin, 'mint', new Args().add(addressTo), 0);
  }

  /**
   * Transfer a chosen token from the caller to the toAddress.
   * Check first the caller owns the token.
   *
   * @param toAddress - recipient address
   * @param tokenId - Token ID
   */
  transfer(toAddress: string, tokenId: u64, amount: u64): void {
    call(
      this._origin,
      'transfer',
      new Args().add(toAddress).add(tokenId).add(amount),
      0,
    );
  }

  /**
   * Approve an address to transfer a token
   *
   * @param tokenId - Token ID
   * @param address - address to approve
   *
   */
  approve(tokenId: u64, address: string): void {
    call(this._origin, 'approve', new Args().add(tokenId).add(address), 0);
  }

  /**
   * Transfer a chosen token from the fromAddress to the toAddress.
   *
   * @param fromAddress - address of the owner
   * @param toAddress - address of the recipient
   * @param tokenId - Token ID
   *
   * @remarks caller must be an approved address
   *
   */
  transferFrom(fromAddress: string, toAddress: string, tokenId: u64): void {
    call(
      this._origin,
      'transferFrom',
      new Args().add(fromAddress).add(toAddress).add(tokenId),
      0,
    );
  }

  /**
   * Get the approved address(es) of a token
   *
   * @param tokenId - Token ID
   *
   * @returns an array of the approved address(es)
   *
   */
  getApproved(tokenId: u64): string[] {
    const addresses = bytesToString(
      call(this._origin, 'getApproved', new Args().add(tokenId), 0),
    );
    if (addresses == '') return [];
    return addresses.split(',');
  }
}
