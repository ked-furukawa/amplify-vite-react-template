import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'csvUploadBucket',
  access: (allow) => ({
    'csv-uploads/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read', 'write'])
    ],
    'deliveryData/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read', 'write'])
    ],
    'invoiceData/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read', 'write'])
    ],
    'accountsReceivable/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read', 'write'])
    ],
    'paymentData/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read', 'write'])
    ],
    'orderItems/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read', 'write'])
    ],
    'documentVerification/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read', 'write'])
    ],
    'paymentSchedule/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read', 'write'])
    ],
    'accountsPayable/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read', 'write'])
    ]
  })
}); 