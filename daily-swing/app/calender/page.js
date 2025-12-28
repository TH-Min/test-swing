"use client"
import React, { useMemo, useState, useEffect } from "react"

function getMonthMatrix(year, month) {
  const first = new Date(year, month, 1)
  const startDay = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7
  const matrix = []
  let day = 1 - startDay
  for (let i = 0; i < totalCells; i++) {
    matrix.push(new Date(year, month, day))
    day++
  }
  return matrix
}

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"]

// events will be loaded from the Supabase-backed API

function formatDateKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export default function Page() {
  const today = new Date()
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const matrix = useMemo(() => getMonthMatrix(view.year, view.month), [view])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    fetch('/api/events')
      .then(r => r.json())
      .then(data => {
        if (!mounted) return
        if (data?.error) {
          setError(data.error)
          setEvents([])
        } else {
          // normalize dates to YYYY-MM-DD
          const normalized = (data || []).map(e => ({
            ...e,
            date: e.date ? new Date(e.date).toISOString().slice(0,10) : null
          }))
          setEvents(normalized)
        }
      })
      .catch(err => {
        if (!mounted) return
        setError(String(err))
      })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  const eventsByDate = useMemo(() => {
    const map = new Map()
    for (const ev of events) {
      if (!ev?.date) continue
      map.set(ev.date, (map.get(ev.date) || []).concat(ev))
    }
    return map
  }, [events])

  function prevMonth() {
    setView(v => {
      const m = v.month - 1
      if (m < 0) return { year: v.year - 1, month: 11 }
      return { year: v.year, month: m }
    })
  }

  function nextMonth() {
    setView(v => {
      const m = v.month + 1
      if (m > 11) return { year: v.year + 1, month: 0 }
      return { year: v.year, month: m }
    })
  }

  return (
    <div className="calendar-root">
      <header className="cal-header">
        <button className="nav" onClick={prevMonth} aria-label="Previous month">◀</button>
        <div className="title">{view.year}년 {view.month + 1}월</div>
        <button className="nav" onClick={nextMonth} aria-label="Next month">▶</button>
      </header>

      <div className="day-names">
        {DAY_NAMES.map(d => <div key={d} className="day-name">{d}</div>)}
      </div>

      {loading && <div style={{padding:12,color:'rgba(255,255,255,0.7)'}}>로딩 중…</div>}
      {error && <div style={{padding:12,color:'#ff8b8b'}}>에러: {error}</div>}

      <div className="grid">
        {matrix.map((date, idx) => {
          const isCurrentMonth = date.getMonth() === view.month
          const key = formatDateKey(date)
          const events = eventsByDate.get(key) || []
          return (
            <div key={idx} className={`cell ${isCurrentMonth ? '' : 'muted'}`}>
              <div className="cell-header">
                <span className={`date ${formatDateKey(today) === key ? 'today' : ''}`}>{date.getDate()}</span>
              </div>
              <div className="events">
                {events.slice(0,3).map(ev => (
                  <div key={ev.id} className="event" style={{background: ev.color || '#ddd'}} title={ev.title}>
                    <div className="ev-thumb" style={{backgroundImage: ev.image_url ? `url(${ev.image_url})` : undefined, backgroundSize:'cover'}} />
                    <div className="ev-title">{ev.title}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .calendar-root{color:#fff;background:#000;padding:18px;border-radius:8px}
        .cal-header{display:flex;align-items:center;justify-content:space-between;padding:8px 4px;margin-bottom:8px}
        .title{font-weight:600}
        .nav{background:transparent;border:1px solid rgba(255,255,255,0.06);color:#fff;padding:6px 10px;border-radius:6px}
        .day-names{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;color:rgba(255,255,255,0.6);font-size:13px;margin-bottom:6px}
        .grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
        .cell{min-height:96px;background:transparent;border-radius:6px;padding:6px;border:1px solid rgba(255,255,255,0.03)}
        .cell.muted{opacity:0.35}
        .cell-header{display:flex;justify-content:flex-end}
        .date{font-size:12px;padding:4px 6px;border-radius:16px}
        .date.today{background:#222;color:#fff}
        .events{display:flex;flex-direction:column;gap:6px;margin-top:6px}
        .event{display:flex;align-items:center;gap:8px;padding:6px;border-radius:6px;color:#000;overflow:hidden}
        .ev-thumb{width:40px;height:40px;border-radius:6px;background:rgba(255,255,255,0.6)}
        .ev-title{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        @media (max-width:720px){
          .cell{min-height:88px}
          .ev-thumb{width:36px;height:36px}
        }
      `}</style>
    </div>
  )
}
