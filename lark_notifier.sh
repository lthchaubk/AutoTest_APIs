#!/bin/bash

MSG=$1
#payload for lark
PAYLOAD="{\"content\":{\"text\":\"$MSG\"},\"msg_type\":\"text\"}"

#HOOK
HOOK=

#curl
curl -X POST -H "Content-Type: application/json" -d "$PAYLOAD" $HOOK