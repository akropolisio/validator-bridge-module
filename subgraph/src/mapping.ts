import { BigInt } from "@graphprotocol/graph-ts"
import {
  Contract,
  BridgeStoppedMessage,
  BridgeStartedMessage,
  BridgePausedMessage,
  BridgeResumedMessage,
  RelayMessage,
  RevertMessage,
  WithdrawMessage,
  ApprovedRelayMessage,
  ConfirmMessage,
  ConfirmWithdrawMessage,
  СancellationСonfirmedMessage,
  WithdrawTransferCall,
} from "../generated/Contract/Contract"
import { Message, BridgeMessage } from "../generated/schema"

export function handleRelayMessage(event: RelayMessage): void {
  let message = new Message(event.params.messageID.toHex())
  message.ethAddress = event.params.sender.toHexString()
  message.subAddress = event.params.recipient.toHexString()
  message.amount = event.params.amount
  message.status = "PENDING"
  message.direction = "ETH2SUB"
  message.ethBlockNumber = event.block.number
  message.save()
}

export function handleRevertMessage(event: RevertMessage): void {
  changeMessageStatus(event.params.messageID.toHex(), "CANCELED")
}

export function handleWithdrawMessage(event: WithdrawMessage): void {
  let message = new Message(event.params.messageID.toHex())
  message.ethAddress = event.params.substrateSender.toHexString()
  message.subAddress = event.params.recipient.toHexString()
  message.amount = event.params.amount
  message.status = "WITHDRAW"
  message.direction = "SUB2ETH"
  message.ethBlockNumber = event.block.number
  message.save()
}

export function handleApprovedRelayMessage(event: ApprovedRelayMessage): void {
  changeMessageStatus(event.params.messageID.toHex(), "APPROVED")
}

export function handleConfirmMessage(event: ConfirmMessage): void {
  changeMessageStatus(event.params.messageID.toHex(), "CONFIRMED")
}

export function handleConfirmWithdrawMessage(event: ConfirmWithdrawMessage): void {
  changeMessageStatus(event.params.messageID.toHex(), "CONFIRMED_WITHDRAW")
}

export function handleСancellationСonfirmedMessage(event: СancellationСonfirmedMessage): void {
  changeMessageStatus(event.params.messageID.toHex(), "CANCELED")
}

export function handleBridgeStoppedMessage(event: BridgeStoppedMessage): void {
  let bridge_message = new BridgeMessage(event.params.messageID.toHex())
  bridge_message.action = "STOP"
  bridge_message.sender = event.params.sender.toHexString();
  bridge_message.ethBlockNumber = event.block.number
  bridge_message.save()
}

export function handleBridgeStartedMessage(event: BridgeStartedMessage): void {
  let bridge_message = new BridgeMessage(event.params.messageID.toHex())
  bridge_message.action = "START"
  bridge_message.sender = event.params.sender.toHexString();
  bridge_message.ethBlockNumber = event.block.number
  bridge_message.save()
}

export function handleBridgePausedMessage(event: BridgePausedMessage): void {
  let bridge_message = new BridgeMessage(event.params.messageID.toHex())
  bridge_message.action = "PAUSE"
  bridge_message.ethBlockNumber = event.block.number
  bridge_message.save()
}

export function handleBridgeResumedMessage(event: BridgeResumedMessage): void {
  let bridge_message = new BridgeMessage(event.params.messageID.toHex())
  bridge_message.action = "RESUME"
  bridge_message.ethBlockNumber = event.block.number
  bridge_message.save()
}

function changeMessageStatus(id: String, status: String): void {
  let message = Message.load(id)
  if (message != null) {
    message.status = status
    message.save()
  }
}