'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import StoreLayout from '@/components/StoreLayout'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { 
  Settings as SettingsIcon, CreditCard, Users, Store as StoreIcon, 
  MapPin, Globe, Mail, Phone, Save, Crown, Calendar, Download, Check, FileText
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { token, user } = useAuthStore()
  const [store, setStore] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('VIEWER')
  const [inviting, setInviting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    websiteUrl: '',
    logoUrl: '',
  })

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }
    fetchData()
  }, [token])

  const fetchData = async () => {
    try {
      const [storeRes, invoicesRes, teamRes] = await Promise.all([
        api.get('/stores/me'),
        api.get('/billing/invoices').catch(() => ({ data: [] })),
        api.get('/team').catch(() => ({ data: [] })),
      ])
      
      setStore(storeRes.data)
      setInvoices(invoicesRes.data || [])
      setTeamMembers(teamRes.data || [])
      setFormData({
        name: storeRes.data.name,
        description: storeRes.data.description || '',
        websiteUrl: storeRes.data.websiteUrl || '',
        logoUrl: storeRes.data.logoUrl || '',
      })
    } catch (error: any) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.patch('/stores/me', formData)
      toast.success('Settings saved successfully')
      fetchData()
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const { data } = await api.get(`/billing/invoices/${invoiceId}/download`)
      // Create a simple text invoice for now
      const invoiceText = `
INVOICE: ${data.invoiceNumber}
Date: ${new Date(data.date).toLocaleDateString()}
Store: ${data.storeName}

${data.lineItems.map((item: any) => `${item.description}: €${item.total}`).join('\n')}

Total: €${data.total}
      `
      const blob = new Blob([invoiceText], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${data.invoiceNumber}.txt`
      a.click()
      toast.success('Invoice downloaded')
    } catch (error) {
      toast.error('Failed to download invoice')
    }
  }

  const handleInviteTeamMember = async () => {
    if (!inviteEmail || !inviteRole) {
      toast.error('Please enter email and select a role')
      return
    }

    setInviting(true)
    try {
      const { data } = await api.post('/team/invite', {
        email: inviteEmail,
        role: inviteRole,
      })
      toast.success('Team member invited successfully')
      setShowInviteModal(false)
      setInviteEmail('')
      setInviteRole('VIEWER')
      fetchData()
      
      // Show invite link
      console.log('Invite link:', data.inviteLink)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to invite team member')
    } finally {
      setInviting(false)
    }
  }

  const handleRemoveTeamMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) {
      return
    }

    try {
      await api.delete(`/team/${memberId}`)
      toast.success('Team member removed')
      fetchData()
    } catch (error) {
      toast.error('Failed to remove team member')
    }
  }

  const handleResendInvite = async (memberId: string) => {
    try {
      const { data } = await api.post(`/team/${memberId}/resend`)
      toast.success('Invite resent successfully')
      console.log('New invite link:', data.inviteLink)
    } catch (error) {
      toast.error('Failed to resend invite')
    }
  }

  if (loading) {
    return (
      <StoreLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600 font-light">Loading settings...</p>
          </div>
        </div>
      </StoreLayout>
    )
  }

  if (!store) return null

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
    { id: 'plan', label: 'Plan', icon: Crown },
    { id: 'team', label: 'Team', icon: Users },
  ]

  return (
    <StoreLayout storeName={store.name} storeSlug={store.slug}>
      <div className="p-8 lg:p-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-serif font-medium text-neutral-900 mb-3 tracking-tight">Settings</h1>
          <p className="text-lg text-neutral-600 font-light">Manage your store preferences and account</p>
        </div>

        {/* Modern Tab Navigation */}
        <div className="mb-12">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-medium uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-8">
            <div className="bg-white border border-neutral-200 p-8 lg:p-12">
              <h2 className="text-3xl font-serif font-medium text-neutral-900 mb-8 flex items-center gap-3">
                <StoreIcon className="w-7 h-7 stroke-[1.5]" />
                Store Information
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-medium text-neutral-900 mb-3">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light text-lg"
                    placeholder="Your Store Name"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-medium text-neutral-900 mb-3">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors resize-none font-light"
                    placeholder="Tell customers about your store..."
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-medium text-neutral-900 mb-3">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      className="w-full pl-14 pr-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light"
                      placeholder="https://yourstore.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-medium text-neutral-900 mb-3">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="w-full px-4 py-4 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors font-light"
                    placeholder="https://yourstore.com/logo.png"
                  />
                  {formData.logoUrl && (
                    <img
                      src={formData.logoUrl}
                      alt="Store logo preview"
                      className="mt-6 w-24 h-24 object-cover border border-neutral-200"
                    />
                  )}
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-neutral-900 text-white px-8 py-4 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3 text-sm uppercase tracking-widest font-medium"
                >
                  <Save className="w-5 h-5 stroke-[1.5]" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Store Details (Read-only) */}
            <div className="bg-white border border-neutral-200 p-8 lg:p-12">
              <h2 className="text-3xl font-serif font-medium text-neutral-900 mb-8">Store Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-start gap-4 p-6 bg-neutral-50 border border-neutral-100">
                  <MapPin className="w-6 h-6 text-neutral-400 mt-1 stroke-[1.5]" />
                  <div>
                    <p className="text-xs uppercase tracking-widest font-medium text-neutral-500 mb-2">Location</p>
                    <p className="text-lg font-light text-neutral-900">{store.city.name}</p>
                    <p className="text-sm text-neutral-600">{store.city.country}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-neutral-50 border border-neutral-100">
                  <StoreIcon className="w-6 h-6 text-neutral-400 mt-1 stroke-[1.5]" />
                  <div>
                    <p className="text-xs uppercase tracking-widest font-medium text-neutral-500 mb-2">Platform</p>
                    <p className="text-lg font-light text-neutral-900 capitalize">{store.platform}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-neutral-50 border border-neutral-100">
                  <Calendar className="w-6 h-6 text-neutral-400 mt-1 stroke-[1.5]" />
                  <div>
                    <p className="text-xs uppercase tracking-widest font-medium text-neutral-500 mb-2">Member Since</p>
                    <p className="text-lg font-light text-neutral-900">
                      {new Date(store.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing & Invoices */}
        {activeTab === 'billing' && (
          <div className="space-y-8">
            {/* Current Billing */}
            <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 p-8 lg:p-12">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-serif font-medium text-neutral-900 mb-2 flex items-center gap-3">
                    <CreditCard className="w-7 h-7 stroke-[1.5]" />
                    Current Billing
                  </h2>
                  <p className="text-neutral-600 font-light">Your monthly subscription details</p>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-800 text-xs font-medium uppercase tracking-wider">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white border border-neutral-200">
                  <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-2">Monthly Fee</p>
                  <p className="text-4xl font-light text-neutral-900">€{store.city.monthlyFee}</p>
                  <p className="text-xs text-neutral-500 mt-2">Billed monthly</p>
                </div>
                <div className="p-6 bg-white border border-neutral-200">
                  <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-2">Marketing Share</p>
                  <p className="text-4xl font-light text-blue-600">€{(store.city.monthlyFee * 0.8).toFixed(0)}</p>
                  <p className="text-xs text-neutral-500 mt-2">80% to marketing</p>
                </div>
                <div className="p-6 bg-white border border-neutral-200">
                  <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-2">Next Billing</p>
                  <p className="text-lg font-light text-neutral-900">
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2">Auto-renewal</p>
                </div>
              </div>
            </div>

            {/* Invoices */}
            <div className="bg-white border border-neutral-200 p-8 lg:p-12">
              <h2 className="text-3xl font-serif font-medium text-neutral-900 mb-8 flex items-center gap-3">
                <FileText className="w-7 h-7 stroke-[1.5]" />
                Invoice History
              </h2>

              {invoices.length > 0 ? (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-6 border border-neutral-200 hover:border-neutral-300 transition-colors"
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 flex items-center justify-center ${
                          invoice.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {invoice.status === 'paid' ? (
                            <Check className="w-6 h-6 text-green-600 stroke-[2]" />
                          ) : (
                            <Clock className="w-6 h-6 text-yellow-600 stroke-[2]" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 text-lg">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-neutral-600 font-light">
                            {new Date(invoice.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-2xl font-light text-neutral-900">€{invoice.amount}</p>
                          <p className={`text-xs uppercase tracking-wider font-medium ${
                            invoice.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {invoice.status}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          className="p-3 border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 transition-all"
                          title="Download Invoice"
                        >
                          <Download className="w-5 h-5 stroke-[1.5]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4 stroke-[1.5]" />
                  <p className="text-neutral-600 font-light">No invoices available yet</p>
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="bg-neutral-50 border border-neutral-200 p-8">
              <h3 className="text-xl font-serif font-medium text-neutral-900 mb-4">Billing Support</h3>
              <p className="text-neutral-700 font-light mb-6">
                Questions about your billing? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:billing@livero.com"
                  className="flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900 font-light"
                >
                  <Mail className="w-4 h-4 stroke-[1.5]" />
                  billing@livero.com
                </a>
                <a
                  href="tel:+43123456789"
                  className="flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900 font-light"
                >
                  <Phone className="w-4 h-4 stroke-[1.5]" />
                  +43 1 234 5678
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Plan Settings */}
        {activeTab === 'plan' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 p-8 lg:p-12">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-serif font-medium text-neutral-900 mb-2 flex items-center gap-3">
                    <Crown className="w-7 h-7 text-amber-500 stroke-[1.5]" />
                    Current Plan
                  </h2>
                  <p className="text-neutral-600 font-light">Active Livero Store Membership</p>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-800 text-xs font-medium uppercase tracking-wider">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-white border border-neutral-200">
                  <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-2">Monthly Fee</p>
                  <p className="text-4xl font-light text-neutral-900">€{store.city.monthlyFee}</p>
                  <p className="text-xs text-neutral-500 mt-2">Per month</p>
                </div>
                <div className="p-6 bg-white border border-neutral-200">
                  <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-2">Marketing Budget</p>
                  <p className="text-4xl font-light text-blue-600">€{(store.city.monthlyFee * 0.8).toFixed(0)}</p>
                  <p className="text-xs text-neutral-500 mt-2">Collective fund</p>
                </div>
                <div className="p-6 bg-white border border-neutral-200">
                  <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-2">Platform Fee</p>
                  <p className="text-4xl font-light text-neutral-900">€{(store.city.monthlyFee * 0.2).toFixed(0)}</p>
                  <p className="text-xs text-neutral-500 mt-2">Infrastructure</p>
                </div>
              </div>
            </div>

            {/* Plan Features */}
            <div className="bg-white border border-neutral-200 p-8 lg:p-12">
              <h2 className="text-3xl font-serif font-medium text-neutral-900 mb-8">Plan Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  'Unlimited product listings',
                  'Advanced analytics dashboard',
                  'Priority customer support',
                  'Featured in city marketplace',
                  'Collective marketing campaigns',
                  'SEO optimization',
                  'Mobile-optimized storefront',
                  'Automatic product syncing',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-neutral-50 border border-neutral-100">
                    <div className="w-8 h-8 bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-green-600 stroke-[2]" />
                    </div>
                    <p className="text-neutral-900 font-light">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Settings */}
        {activeTab === 'team' && (
          <div className="space-y-8">
            <div className="bg-white border border-neutral-200 p-8 lg:p-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif font-medium text-neutral-900 flex items-center gap-3">
                  <Users className="w-7 h-7 stroke-[1.5]" />
                  Team Members
                </h2>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-800 transition-all flex items-center gap-2 text-sm uppercase tracking-wider"
                >
                  <Mail className="w-4 h-4" />
                  Invite Member
                </button>
              </div>

              <div className="space-y-4">
                {/* Owner */}
                <div className="flex items-center justify-between p-6 bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-neutral-900 text-white flex items-center justify-center font-semibold text-xl">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 text-lg">{user?.email}</p>
                      <p className="text-sm text-neutral-600 font-light">Owner · Full Access</p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 text-xs font-medium uppercase tracking-wider">
                    You
                  </span>
                </div>

                {/* Team Members */}
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-6 border border-neutral-200 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-neutral-200 text-neutral-700 flex items-center justify-center font-semibold text-xl">
                        {member.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 text-lg">{member.email}</p>
                        <p className="text-sm text-neutral-600 font-light">
                          {member.role} · {member.acceptedAt ? 'Active' : 'Pending Invite'}
                        </p>
                        {!member.acceptedAt && (
                          <p className="text-xs text-neutral-500 mt-1">
                            Invited {new Date(member.invitedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!member.acceptedAt && (
                        <button
                          onClick={() => handleResendInvite(member.id)}
                          className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-xs uppercase tracking-wider transition-colors"
                        >
                          Resend Invite
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveTeamMember(member.id)}
                        className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 text-xs uppercase tracking-wider transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {teamMembers.length === 0 && (
                  <div className="p-12 border-2 border-dashed border-neutral-200 text-center">
                    <Users className="w-16 h-16 text-neutral-300 mx-auto mb-6 stroke-[1.5]" />
                    <h3 className="text-2xl font-serif font-medium text-neutral-900 mb-3">No Team Members Yet</h3>
                    <p className="text-neutral-600 font-light max-w-md mx-auto mb-6">
                      Invite team members to help manage your store. You can assign different roles and permissions.
                    </p>
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-800 transition-all inline-flex items-center gap-2 text-sm uppercase tracking-wider"
                    >
                      <Mail className="w-4 h-4" />
                      Invite Your First Member
                    </button>
                  </div>
                )}
              </div>

              {/* Team Roles Info */}
              <div className="mt-8 p-6 bg-neutral-50 border border-neutral-100">
                <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-900 mb-4">Team Roles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-neutral-900 mb-1">ADMIN</p>
                    <p className="text-neutral-600 font-light">Full access to all store settings and team management</p>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 mb-1">EDITOR</p>
                    <p className="text-neutral-600 font-light">Can manage products and view analytics</p>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 mb-1">VIEWER</p>
                    <p className="text-neutral-600 font-light">Read-only access to store data and analytics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white max-w-md w-full border border-neutral-200 p-8">
              <h3 className="text-2xl font-serif font-medium text-neutral-900 mb-6">Invite Team Member</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-neutral-900 mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors"
                    placeholder="team@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-neutral-900 mb-3">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors"
                  >
                    <option value="VIEWER">Viewer</option>
                    <option value="EDITOR">Editor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleInviteTeamMember}
                    disabled={inviting}
                    className="flex-1 bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-800 disabled:opacity-50 transition-all text-sm uppercase tracking-wider"
                  >
                    {inviting ? 'Sending...' : 'Send Invite'}
                  </button>
                  <button
                    onClick={() => {
                      setShowInviteModal(false)
                      setInviteEmail('')
                      setInviteRole('VIEWER')
                    }}
                    className="flex-1 border border-neutral-300 text-neutral-700 px-6 py-3 hover:bg-neutral-50 transition-all text-sm uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  )
}

function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}
