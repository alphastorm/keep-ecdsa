// Package eth contains interface for interaction with an ethereum blockchain
// along with structures reflecting events emitted on an ethereum blockchain.
package eth

import (
	cecdsa "crypto/ecdsa"

	"github.com/ethereum/go-ethereum/common"
	"github.com/keep-network/keep-core/pkg/subscription"
	"github.com/keep-network/keep-tecdsa/pkg/ecdsa"
)

// Handle represents a handle to an ethereum blockchain.
type Handle interface {
	// Address returns client's ethereum address.
	Address() common.Address
	// PublicKey returns client's ethereum public key.
	PublicKey() *cecdsa.PublicKey

	BondedECDSAKeepFactory
	BondedECDSAKeep
}

// BondedECDSAKeepFactory is an interface that provides ability to interact with
// BondedECDSAKeepFactory ethereum contracts.
type BondedECDSAKeepFactory interface {
	// RegisterAsMemberCandidate registers client as a candidate to be selected
	// to a keep.
	RegisterAsMemberCandidate(application common.Address) error

	// OnBondedECDSAKeepCreated is a callback that is invoked when an on-chain
	// notification of a new bonded ECDSA keep creation is seen.
	OnBondedECDSAKeepCreated(
		handler func(event *BondedECDSAKeepCreatedEvent),
	) (subscription.EventSubscription, error)
}

// BondedECDSAKeep is an interface that provides ability to interact with BondedECDSAKeep
// ethereum contracts.
type BondedECDSAKeep interface {
	// OnSignatureRequested is a callback that is invoked when an on-chain
	// notification of a new signing request for a given keep is seen.
	OnSignatureRequested(
		keepAddress common.Address,
		handler func(event *SignatureRequestedEvent),
	) (subscription.EventSubscription, error)

	// SubmitKeepPublicKey submits a 64-byte serialized public key to a keep
	// contract deployed under a given address.
	SubmitKeepPublicKey(keepAddress common.Address, publicKey [64]byte) error // TODO: Add promise *async.KeepPublicKeySubmissionPromise

	// SubmitSignature submits a signature to a keep contract deployed under a
	// given address.
	SubmitSignature(
		keepAddress common.Address,
		signature *ecdsa.Signature,
	) error // TODO: Add promise *async.SignatureSubmissionPromise

	// IsAwaitingSignature checks if the keep is waiting for a signature to be
	// calculated for the given digest.
	IsAwaitingSignature(keepAddress common.Address, digest [32]byte) (bool, error)
}
