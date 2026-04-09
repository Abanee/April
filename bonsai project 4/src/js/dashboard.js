/**
 * dashboard.js — Logic for populating the Client Portal Dashboard
 * Populates: Care Reminders, Workshops, and Purchase History
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Data ---
  const reminders = [
    { title: 'Water Japanese Juniper', detail: 'Needs deep watering today', priority: 'high', date: 'Today' },
    { title: 'Fertilise Chinese Elm', detail: 'Organic 5-5-5 recommended', priority: 'medium', date: 'Tomorrow' },
    { title: 'Rotate Ficus', detail: 'Ensure even sun exposure', priority: 'low', date: 'Thursday' },
    { title: 'Prune Maple', detail: 'Spring maintenance pruning', priority: 'medium', date: 'Saturday' }
  ];

  const workshops = [
    { title: 'Advanced Pruning Techniques', date: '12 April 2025', status: 'Booked', color: 'emerald' },
    { title: 'Winter Dormancy Masterclass', date: '26 April 2025', status: 'Confirmed', color: 'blue' }
  ];

  const purchases = [
    { item: 'Japanese Juniper (12yrs)', date: '15 Jan 2026', price: '$285.00', status: 'Delivered' },
    { item: 'Care Kit Alpha', date: '02 Feb 2026', price: '$45.00', status: 'Delivered' },
    { item: 'Shaped Copper Wire Set', date: '10 March 2026', price: '$32.00', status: 'In Transit' }
  ];

  // --- Renderers ---
  function renderReminders() {
    const container = document.getElementById('remindersContainer');
    if (!container) return;
    
    container.innerHTML = reminders.map(r => `
      <div class="flex items-center gap-4 p-3.5 rounded-xl border border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
          r.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 
          r.priority === 'medium' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500'
        }">
          ${r.priority === 'high' ? '💧' : r.priority === 'medium' ? '🌱' : '☀️'}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">${r.title}</p>
          <p class="text-xs text-stone-400 dark:text-stone-500">${r.detail}</p>
        </div>
        <div class="text-right flex-shrink-0">
          <p class="text-[10px] font-bold uppercase tracking-wider text-stone-400">${r.date}</p>
        </div>
      </div>
    `).join('');
  }

  function renderWorkshops() {
    const containers = [
      document.getElementById('workshopsContainer'),
      document.getElementById('workshopsContainer2')
    ];
    
    const html = workshops.map(w => `
      <div class="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <span class="text-[10px] bg-${w.color}-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">${w.status}</span>
          <svg class="w-4 h-4 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
        <h3 class="font-cormorant text-lg font-bold text-stone-800 dark:text-stone-100 leading-tight mb-2">${w.title}</h3>
        <p class="text-xs text-stone-400 mb-4">${w.date} · 10:00 AM</p>
        <button class="w-full py-2 text-xs font-semibold rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">Session Details</button>
      </div>
    `).join('');

    containers.forEach(c => { if (c) c.innerHTML = html; });
  }

  function renderPurchases() {
    const containers = [
      document.getElementById('purchasesContainer'),
      document.getElementById('purchasesContainer2')
    ];

    const html = `
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-[10px] uppercase tracking-widest text-stone-400 border-b border-stone-50 dark:border-stone-800">
              <th class="py-4 font-semibold">Item</th>
              <th class="py-4 font-semibold">Date</th>
              <th class="py-4 font-semibold">Price</th>
              <th class="py-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-50 dark:divide-stone-800/50">
            ${purchases.map(p => `
              <tr>
                <td class="py-4 text-sm font-medium text-stone-800 dark:text-stone-200">${p.item}</td>
                <td class="py-4 text-xs text-stone-400">${p.date}</td>
                <td class="py-4 text-xs font-mono text-stone-600 dark:text-stone-400">${p.price}</td>
                <td class="py-4 text-right">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.status === 'Delivered' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' : 'bg-blue-50 dark:bg-blue-950/30 text-blue-500'
                  }">${p.status}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    containers.forEach(c => { if (c) c.innerHTML = html; });
  }

  // --- Initialize ---
  renderReminders();
  renderWorkshops();
  renderPurchases();

  // Watch for section switches to re-populate mirrored containers if needed 
  // (Though we've already populated both above)
});
