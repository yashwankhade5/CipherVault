/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/cipher_valut.json`.
 */
export type CipherValut = {
  "address": "ALyuWP3baEXSzYhHfVYh37UPEzupM518d8XfbibcK1hj",
  "metadata": {
    "name": "cipherValut",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "approval",
      "discriminator": [
        230,
        210,
        15,
        235,
        90,
        219,
        237,
        191
      ],
      "accounts": [
        {
          "name": "approver",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig"
        },
        {
          "name": "transaction",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "createMultisig",
      "discriminator": [
        148,
        146,
        240,
        10,
        226,
        215,
        167,
        174
      ],
      "accounts": [
        {
          "name": "multiSig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "arg",
                "path": "name"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "multiSig"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "threshold",
          "type": "u8"
        },
        {
          "name": "owners",
          "type": {
            "vec": "pubkey"
          }
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "amount",
          "type": {
            "option": "u64"
          }
        }
      ]
    },
    {
      "name": "createTransaction",
      "discriminator": [
        227,
        193,
        53,
        239,
        55,
        126,
        112,
        105
      ],
      "accounts": [
        {
          "name": "multisig",
          "writable": true
        },
        {
          "name": "proposer",
          "writable": true,
          "signer": true
        },
        {
          "name": "transactionAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  97,
                  99,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "multisig"
              },
              {
                "kind": "account",
                "path": "multisig.transaction_count",
                "account": "multisig"
              }
            ]
          }
        },
        {
          "name": "reciepient"
        },
        {
          "name": "vault"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "splToken",
          "type": {
            "option": {
              "defined": {
                "name": "splTokenData"
              }
            }
          }
        }
      ]
    },
    {
      "name": "fnExecute",
      "discriminator": [
        7,
        237,
        222,
        63,
        98,
        130,
        129,
        249
      ],
      "accounts": [
        {
          "name": "multisig",
          "writable": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "transactionAccount",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "reciepientAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "multisig",
      "discriminator": [
        224,
        116,
        121,
        186,
        68,
        161,
        79,
        236
      ]
    },
    {
      "name": "transactionAccount",
      "discriminator": [
        146,
        125,
        253,
        167,
        250,
        226,
        175,
        123
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidOwnerError",
      "msg": "Invalid owner tried to approve"
    },
    {
      "code": 6001,
      "name": "notEnoughApproval",
      "msg": "not enough approvals"
    },
    {
      "code": 6002,
      "name": "reciepientAccountNotReceived",
      "msg": "reciepient account not recieved"
    },
    {
      "code": 6003,
      "name": "proposeNotinOwners",
      "msg": "propser not in onwers"
    },
    {
      "code": 6004,
      "name": "notEnoughSol",
      "msg": "not enough sol in vault"
    },
    {
      "code": 6005,
      "name": "overflow",
      "msg": "overflow count"
    },
    {
      "code": 6006,
      "name": "underflow",
      "msg": "Underflow count"
    },
    {
      "code": 6007,
      "name": "duplicateOwners",
      "msg": "duplicate owners"
    }
  ],
  "types": [
    {
      "name": "multisig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "owners",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "splToken",
            "type": {
              "vec": {
                "defined": {
                  "name": "splTokenData"
                }
              }
            }
          },
          {
            "name": "threshold",
            "type": "u8"
          },
          {
            "name": "transactionCount",
            "type": "u32"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "txPending",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "splTokenData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "transactionAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "multisig",
            "type": "pubkey"
          },
          {
            "name": "valut",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "approval",
            "type": {
              "vec": "bool"
            }
          },
          {
            "name": "splToken",
            "type": {
              "defined": {
                "name": "splTokenData"
              }
            }
          },
          {
            "name": "executed",
            "type": "bool"
          },
          {
            "name": "reciepient",
            "type": "pubkey"
          },
          {
            "name": "proposer",
            "type": "pubkey"
          },
          {
            "name": "date",
            "type": "i64"
          },
          {
            "name": "executedAt",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
