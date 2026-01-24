export type PlanId = 'free' | 'pro' | 'enterprise'

export type Plan = {
  id: PlanId
  name: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0 / month',
    description: 'For personal use and small experiments',
    features: [
      '1 project',
      'Basic task management',
      'Community support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$12 / month',
    description: 'For growing teams and serious work',
    features: [
      'Unlimited projects',
      'Advanced workflows',
      'Team collaboration',
      'Priority support'
    ],
    highlighted: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$29 / month',
    description: 'Full power for professional teams',
    features: [
      'Everything in Pro',
      'Advanced permissions',
      'Audit logs',
      'SSO',
      'Dedicated support'
    ]
  }
]
