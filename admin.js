document.addEventListener('DOMContentLoaded', () => {
    
    const tbody = document.getElementById('bookings-tbody');
    const statTotal = document.getElementById('stat-total');
    const statConfirmed = document.getElementById('stat-confirmed');
    const statPending = document.getElementById('stat-pending');
    const statRevenue = document.getElementById('stat-revenue');
    
    function loadBookings() {
        let bookings = JSON.parse(localStorage.getItem('chamunda_bookings')) || [];
        
        // Stats
        let total = bookings.length;
        let confirmed = bookings.filter(b => b.status === 'Confirmed').length;
        let pending = bookings.filter(b => b.status === 'Pending').length;
        
        let revenue = 0;
        bookings.forEach(b => {
            if(b.price) {
                // Remove $ and commas and parse
                revenue += parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
            }
        });
        
        statTotal.textContent = total;
        statConfirmed.textContent = confirmed;
        statPending.textContent = pending;
        statRevenue.textContent = '$' + revenue.toLocaleString();
        
        // Render Table
        if(bookings.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8">
                        <div class="empty-state">
                            <i class="fa-solid fa-box-open"></i>
                            <p>No booking requests found. When a user submits the VIP Booking form, it will appear here.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = '';
        bookings.forEach((b, index) => {
            const dateStr = new Date(b.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const tr = document.createElement('tr');
            
            let statusClass = b.status === 'Pending' ? 'status-pending' : 'status-confirmed';
            
            tr.innerHTML = `
                <td><strong>${b.id || 'N/A'}</strong></td>
                <td>${dateStr}</td>
                <td>
                    <div style="display: flex; flex-direction: column;">
                        <strong>${b.name || 'Anonymous'}</strong>
                        <span style="font-size: 0.8rem; color: #64748b;">${b.email || 'N/A'}</span>
                    </div>
                </td>
                <td><i class="fa-solid fa-location-dot" style="color: var(--clr-luxury-gold); margin-right: 5px;"></i> ${b.destination || 'Unspecified'}</td>
                <td>${b.date || 'Flexible'}</td>
                <td>${b.price || 'TBD'}</td>
                <td><span class="status-badge ${statusClass}">${b.status}</span></td>
                <td>
                    <button onclick="toggleStatus(${index})" style="background: none; border: none; color: #94a3b8; cursor: pointer; padding: 5px; margin-right: 10px;" title="Mark Confirmed">
        } else {
            tbody.innerHTML = '';
            bookings.forEach((b, index) => {
                const dateStr = new Date(b.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const tr = document.createElement('tr');
                
                let statusClass = b.status === 'Pending' ? 'status-pending' : 'status-confirmed';
                
                tr.innerHTML = `
                    <td><strong>${b.id || 'N/A'}</strong></td>
                    <td>${dateStr}</td>
                    <td>
                        <div style="display: flex; flex-direction: column;">
                            <strong>${b.name || 'Anonymous'}</strong>
                            <span style="font-size: 0.8rem; color: #64748b;">${b.email || 'N/A'}</span>
                        </div>
                    </td>
                    <td><i class="fa-solid fa-location-dot" style="color: var(--clr-luxury-gold); margin-right: 5px;"></i> ${b.destination || 'Unspecified'}</td>
                    <td>${b.date || 'Flexible'}</td>
                    <td>${b.price || 'TBD'}</td>
                    <td><span class="status-badge ${statusClass}">${b.status}</span></td>
                    <td>
                        <button onclick="toggleStatus(${index})" style="background: none; border: none; color: #94a3b8; cursor: pointer; padding: 5px; margin-right: 10px;" title="Mark Confirmed">
                            <i class="fa-solid fa-check-circle" style="font-size: 1.1rem; color: ${b.status === 'Confirmed' ? '#10b981' : '#94a3b8'}"></i>
                        </button>
                        <button onclick="deleteBooking(${index})" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 5px;" title="Delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
        
        // --- LOAD OTA FEATURES ---
        // 1. Load Admin Wallet View
        let wallet = parseInt(localStorage.getItem('chamunda_wallet')) || 0;
        document.getElementById('admin-wallet-display').textContent = '$' + wallet.toLocaleString();
        
        // 2. Load Promos
        let promos = JSON.parse(localStorage.getItem('chamunda_promos')) || [];
        const promosBody = document.getElementById('promos-tbody');
        if(promos.length === 0) {
            promosBody.innerHTML = '<tr><td colspan="4" class="empty-state">No promo codes created.</td></tr>';
        } else {
            promosBody.innerHTML = '';
            promos.forEach((p, i) => {
                promosBody.innerHTML += `<tr>
                    <td><strong style="color:var(--clr-luxury-gold);">${p.code}</strong></td>
                    <td>${p.discount}%</td>
                    <td><span class="status-badge status-confirmed">Active</span></td>
                    <td><button onclick="deletePromo(${i})" class="action-btn delete"><i class="fa-solid fa-trash"></i></button></td>
                </tr>`;
            });
        }
        
        // 3. Load Support Tickets
        let tickets = JSON.parse(localStorage.getItem('chamunda_tickets')) || [];
        const supportBody = document.getElementById('admin-support-tbody');
        if(tickets.length === 0) {
            supportBody.innerHTML = '<tr><td colspan="5" class="empty-state">No support tickets.</td></tr>';
        } else {
            supportBody.innerHTML = '';
            tickets.forEach((t, i) => {
                let statusClass = t.status === 'Open' ? 'status-pending' : 'status-confirmed';
                supportBody.innerHTML += `<tr>
                    <td><strong>${t.id}</strong></td>
                    <td>${t.issue}</td>
                    <td>${t.date}</td>
                    <td><span class="status-badge ${statusClass}">${t.status}</span></td>
                    <td>
                        ${t.status === 'Open' ? `<button onclick="resolveTicket(${i})" class="action-btn confirm" title="Resolve"><i class="fa-solid fa-check"></i></button>` : ''}
                    </td>
                </tr>`;
            });
        }
    }

    // --- GLOBAL OTA FUNCTIONS ---
    window.issueWalletFunds = function() {
        let amountStr = prompt("Enter amount (USD) to issue to the test user's wallet:");
        let amount = parseInt(amountStr);
        if(!amount || isNaN(amount)) return;
        
        let wallet = parseInt(localStorage.getItem('chamunda_wallet')) || 0;
        wallet += amount;
        localStorage.setItem('chamunda_wallet', wallet);
        loadBookings();
        alert(`Successfully issued $${amount} to user wallet!`);
    };

    window.createPromo = function() {
        let code = prompt("Enter Promo Code Name (e.g. VIP20):");
        if(!code) return;
        let discountStr = prompt("Enter Discount Percentage (e.g. 20):");
        let discount = parseInt(discountStr);
        if(!discount || isNaN(discount)) return;
        
        let promos = JSON.parse(localStorage.getItem('chamunda_promos')) || [];
        promos.push({ code: code.toUpperCase(), discount: discount });
        localStorage.setItem('chamunda_promos', JSON.stringify(promos));
        loadBookings();
    };
    
    window.deletePromo = function(index) {
        let promos = JSON.parse(localStorage.getItem('chamunda_promos')) || [];
        promos.splice(index, 1);
        localStorage.setItem('chamunda_promos', JSON.stringify(promos));
        loadBookings();
    };

    window.resolveTicket = function(index) {
        if(confirm('Mark this support ticket as resolved?')) {
            let tickets = JSON.parse(localStorage.getItem('chamunda_tickets')) || [];
            tickets[index].status = 'Resolved';
            localStorage.setItem('chamunda_tickets', JSON.stringify(tickets));
            loadBookings();
        }
    };

    // Expose functions to window so inline onclick can use them
    window.toggleStatus = function(index) {
        let bookings = JSON.parse(localStorage.getItem('chamunda_bookings')) || [];
        if(bookings[index]) {
            bookings[index].status = bookings[index].status === 'Pending' ? 'Confirmed' : 'Pending';
            localStorage.setItem('chamunda_bookings', JSON.stringify(bookings));
            loadBookings();
        }
    };

    window.deleteBooking = function(index) {
        if(confirm('Are you sure you want to delete this booking request?')) {
            let bookings = JSON.parse(localStorage.getItem('chamunda_bookings')) || [];
            bookings.splice(index, 1);
            localStorage.setItem('chamunda_bookings', JSON.stringify(bookings));
            loadBookings();
        }
    };

    window.clearData = function() {
        if(confirm('WARNING: This will permanently delete ALL mock bookings. Proceed?')) {
            localStorage.removeItem('chamunda_bookings');
            loadBookings();
        }
    };

    // Initialize
    loadBookings();
});
