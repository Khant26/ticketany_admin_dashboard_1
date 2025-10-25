import React, { useEffect, useState } from 'react'

const API_BASE = 'http://127.0.0.1:8000'

function StatusChange() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bulk, setBulk] = useState({ updating: false, updated: 0, total: 0, error: '' })

  const getCSRFToken = () =>
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrftoken='))
      ?.split('=')[1]

  const buildHeaders = (asJson = false) => {
    const token =
      localStorage.getItem('access_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('authToken')
    const headers = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    if (asJson) headers['Content-Type'] = 'application/json'
    const csrf = getCSRFToken()
    if (csrf) headers['X-CSRFToken'] = csrf
    return headers
  }

  // Helper to fetch all paginated items from an endpoint
  const fetchAllPaged = async (startUrl) => {
    let url = startUrl
    const all = []
    while (url) {
      const res = await fetch(url, {
        headers: buildHeaders(false),
        credentials: 'include',
      })
      if (!res.ok) throw new Error(`Failed to fetch (${res.status}) from ${url}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        all.push(...data)
        break
      } else if (data?.results) {
        all.push(...data.results)
        url = data.next
      } else if (data && typeof data === 'object') {
        all.push(data)
        break
      } else {
        break
      }
    }
    return all
  }

  const fetchAllTickets = async () => {
    setLoading(true)
    setError('')
    try {
      // Fetch tickets, orders and customers to derive customer email per ticket
      const [allTickets, allOrders, allCustomers] = await Promise.all([
        fetchAllPaged(`${API_BASE}/api/tickets/`),
        fetchAllPaged(`${API_BASE}/api/orders/`),
        fetchAllPaged(`${API_BASE}/api/customers/`),
      ])

      const toId = (v) => {
        if (v == null) return null
        if (typeof v === 'number') return v
        if (typeof v === 'string') {
          const m = v.match(/(\d+)(?!.*\d)/)
          return m ? Number(m[1]) : null
        }
        return null
      }

      const orderToCustomer = {}
      for (const o of allOrders) {
        const oid = toId(o?.id)
        const cid = toId(o?.customer)
        if (oid != null && cid != null) orderToCustomer[oid] = cid
      }

      const customerToEmail = {}
      for (const c of allCustomers) {
        const cid = toId(c?.id)
        if (cid != null) customerToEmail[cid] = c?.email || null
      }

      const enhanced = allTickets.map((t) => {
        const orderId = toId(t?.order)
        const custId = orderToCustomer[orderId]
        const email = custId != null ? customerToEmail[custId] : null
        return { ...t, customer_email: email }
      })

      setTickets(enhanced)
    } catch (e) {
      setError(e.message || 'Unable to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const patchTicketStatus = async (id, newStatus) => {
    const res = await fetch(`${API_BASE}/api/tickets/${id}/`, {
      method: 'PATCH',
      headers: buildHeaders(true),
      credentials: 'include',
      body: JSON.stringify({ status: newStatus }),
    })
    if (!res.ok) {
      const msg = await res.text().catch(() => '')
      throw new Error(msg || `Failed to update ticket #${id} (${res.status})`)
    }
    return res.json().catch(() => null)
  }

  const bulkUpdate = async (newStatus) => {
    setBulk({ updating: true, updated: 0, total: 0, error: '' })
    try {
      const list = tickets.length ? tickets : await (async () => {
        return fetchAllPaged(`${API_BASE}/api/tickets/`)
      })()

      const toUpdate = list.filter(
        (t) => (t.status || '').toLowerCase() !== (newStatus || '').toLowerCase()
      )
      setBulk((b) => ({ ...b, total: toUpdate.length }))

      let updated = 0
      for (const t of toUpdate) {
        try {
          await patchTicketStatus(t.id, newStatus)
          updated += 1
          setBulk((b) => ({ ...b, updated }))
        } catch {
          // continue on per-item failure
        }
      }
      await fetchAllTickets()
      setBulk((b) => ({ ...b, updating: false }))
    } catch (e) {
      setBulk({ updating: false, updated: 0, total: 0, error: e.message || 'Bulk update failed' })
    }
  }

  const toggleRowStatus = async (t) => {
    const next = (t.status || '').toLowerCase() === 'pending' ? 'received' : 'Pending'
    try {
      await patchTicketStatus(t.id, next)
      setTickets((prev) =>
        prev.map((row) => (row.id === t.id ? { ...row, status: next } : row))
      )
    } catch (e) {
      alert(e.message || 'Failed to update status')
    }
  }

  useEffect(() => {
    fetchAllTickets()
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-black mb-4">Ticket Status Management</h1>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => bulkUpdate('Pending')}
          disabled={bulk.updating || loading}
          className="px-4 py-2 rounded-md font-medium"
          style={{ backgroundColor: '#feb1c3', color: '#000' }}
        >
          Mark all Pending
        </button>
        <button
          type="button"
          onClick={() => bulkUpdate('received')}
          disabled={bulk.updating || loading}
          className="px-4 py-2 rounded-md font-semibold text-white"
          style={{ backgroundColor: '#e51f4b' }}
        >
          Mark all Received
        </button>
        <button
          type="button"
          onClick={fetchAllTickets}
          disabled={bulk.updating || loading}
          className="px-4 py-2 rounded-md border border-gray-300"
        >
          Refresh
        </button>

        {bulk.updating && (
          <span className="text-sm text-gray-600">
            Updating {bulk.updated}/{bulk.total}…
          </span>
        )}
        {bulk.error && <span className="text-sm text-red-600">{bulk.error}</span>}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}
      {loading && <div className="mb-4 text-gray-600">Loading tickets…</div>}

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-[980px] w-full text-left">
          <thead className="bg-gray-50">
            <tr className="text-gray-700">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Passport Name</th>
              <th className="px-3 py-2">Facebook Name</th>
              <th className="px-3 py-2">Customer Email</th>
              <th className="px-3 py-2 whitespace-nowrap">Member Code</th>
              <th className="px-3 py-2 whitespace-nowrap">Priority Date</th>
              <th className="px-3 py-2">1st</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="px-3 py-2">{t.id}</td>
                <td className="px-3 py-2">{t.passport_name || '—'}</td>
                <td className="px-3 py-2">{t.facebook_name || '—'}</td>
                <td className="px-3 py-2 break-all">{t.customer_email || '—'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{t.member_code || '—'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{t.priority_date || '—'}</td>
                <td className="px-3 py-2">{t.fst_pt || '—'}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      (t.status || '').toLowerCase() === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {t.status || '—'}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => toggleRowStatus(t)}
                    className="px-3 py-1 rounded-md text-white"
                    style={{
                      backgroundColor:
                        (t.status || '').toLowerCase() === 'pending' ? '#e51f4b' : '#feb1c3',
                      color: (t.status || '').toLowerCase() === 'pending' ? '#fff' : '#000',
                    }}
                    title="Toggle status"
                  >
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
            {!loading && tickets.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-600" colSpan={9}>
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StatusChange