document.addEventListener('DOMContentLoaded', () => {
    
    const tbody = document.getElementById('user-bookings-tbody');
    const wishlistGrid = document.getElementById('user-wishlist-grid');
    const statTotal = document.getElementById('user-total');
    const statUpcoming = document.getElementById('user-upcoming');
    const statWishlist = document.getElementById('user-wishlist-count');
    
    function loadUserData() {
        // Load Bookings
        let bookings = JSON.parse(localStorage.getItem('chamunda_bookings')) || [];
        
        let total = bookings.length;
        let upcoming = bookings.filter(b => b.status === 'Confirmed').length;
        
        statTotal.textContent = total;
        statUpcoming.textContent = upcoming;
        
        if(total === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5">
                        <div class="empty-state">
                            <i class="fa-solid fa-suitcase"></i>
                            <p>You haven't made any inquiries or bookings yet.</p>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = '';
            bookings.forEach(b => {
                const dateStr = new Date(b.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const tr = document.createElement('tr');
                let statusClass = b.status === 'Pending' ? 'status-pending' : 'status-confirmed';
                
                tr.innerHTML = `
                    <td><strong>${b.id || 'N/A'}</strong></td>
                    <td>${dateStr}</td>
                    <td>
                        <strong>${b.destination || 'General Inquiry'}</strong>
                        <div style="font-size: 0.8rem; color: #64748b;">${b.type || 'Booking'}</div>
                    </td>
                    <td><span class="status-badge ${statusClass}">${b.status}</span></td>
                    <td>
                        <button style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                            View Details
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Load Wishlist
        let wishlist = JSON.parse(localStorage.getItem('chamunda_wishlist')) || [];
        statWishlist.textContent = wishlist.length;

        if(wishlist.length === 0) {
            wishlistGrid.innerHTML = `
                <div style="grid-column: 1 / -1;" class="empty-state">
                    <i class="fa-regular fa-heart"></i>
                    <p>Your wishlist is empty. Start exploring our destinations!</p>
                </div>
            `;
        } else {
            wishlistGrid.innerHTML = '';
            wishlist.forEach(item => {
                const div = document.createElement('div');
                div.className = 'wishlist-card';
                div.onclick = () => window.location.href = item.link;
                div.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="wishlist-overlay">
                        <h3 class="wishlist-title">${item.name}</h3>
                    </div>
                    <button class="remove-wishlist" onclick="event.stopPropagation(); removeFromWishlist('${item.name}')">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                `;
                wishlistGrid.appendChild(div);
            });
        }
        
        // Load Wallet
        let wallet = parseInt(localStorage.getItem('chamunda_wallet')) || 0;
        document.getElementById('user-wallet-balance').textContent = '$' + wallet.toLocaleString();
        document.getElementById('wallet-display').textContent = '$' + wallet.toLocaleString();
        
        // Load Travellers
        let travellers = JSON.parse(localStorage.getItem('chamunda_travellers')) || [];
        const tBody = document.getElementById('travellers-tbody');
        if(travellers.length === 0) {
            tBody.innerHTML = '<tr><td colspan="4" class="empty-state">No saved travellers.</td></tr>';
        } else {
            tBody.innerHTML = '';
            travellers.forEach((t, i) => {
                tBody.innerHTML += `<tr>
                    <td><strong>${t.name}</strong></td>
                    <td>${t.dob}</td>
                    <td>${t.passport}</td>
                    <td><button onclick="removeTraveller(${i})" style="color:#ef4444; background:none; border:none; cursor:pointer;"><i class="fa-solid fa-trash"></i></button></td>
                </tr>`;
            });
        }
        
        // Load Support Tickets
        let tickets = JSON.parse(localStorage.getItem('chamunda_tickets')) || [];
        const sBody = document.getElementById('support-tbody');
        if(tickets.length === 0) {
            sBody.innerHTML = '<tr><td colspan="4" class="empty-state">No active support tickets.</td></tr>';
        } else {
            sBody.innerHTML = '';
            tickets.forEach(t => {
                let statusClass = t.status === 'Open' ? 'status-pending' : 'status-confirmed';
                sBody.innerHTML += `<tr>
                    <td><strong>${t.id}</strong></td>
                    <td>${t.issue}</td>
                    <td>${t.date}</td>
                    <td><span class="status-badge ${statusClass}">${t.status}</span></td>
                </tr>`;
            });
        }
    }

    // Global Functions
    window.switchUserTab = function(tabId, el) {
        document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
        el.classList.add('active');
        
        document.querySelectorAll('.tab-section, #dashboard-section').forEach(sec => sec.style.display = 'none');
        
        if(tabId === 'dashboard') {
            document.getElementById('dashboard-section').style.display = 'grid';
            document.getElementById('bookings-section').style.display = 'block';
            document.getElementById('wishlist-section').style.display = 'block';
        } else {
            const section = document.getElementById(tabId + '-section');
            if(section) section.style.display = 'block';
        }
    };

    window.addTraveller = function() {
        let name = prompt('Enter Traveller Full Name:');
        if(!name) return;
        let dob = prompt('Enter DOB (YYYY-MM-DD):') || 'N/A';
        let passport = prompt('Enter Passport No:') || 'N/A';
        
        let travellers = JSON.parse(localStorage.getItem('chamunda_travellers')) || [];
        travellers.push({ name, dob, passport });
        localStorage.setItem('chamunda_travellers', JSON.stringify(travellers));
        loadUserData();
    };
    
    window.removeTraveller = function(index) {
        let travellers = JSON.parse(localStorage.getItem('chamunda_travellers')) || [];
        travellers.splice(index, 1);
        localStorage.setItem('chamunda_travellers', JSON.stringify(travellers));
        loadUserData();
    };

    window.raiseTicket = function() {
        let issue = prompt('Please briefly describe your issue (e.g. Refund Request for Booking BKG-123):');
        if(!issue) return;
        
        let tickets = JSON.parse(localStorage.getItem('chamunda_tickets')) || [];
        tickets.unshift({
            id: 'TKT-' + Math.floor(Math.random()*90000),
            issue: issue,
            date: new Date().toLocaleDateString(),
            status: 'Open'
        });
        localStorage.setItem('chamunda_tickets', JSON.stringify(tickets));
        loadUserData();
        alert('Support Ticket Raised! Our team will get back to you within 24 hours.');
    };

    window.removeFromWishlist = function(name) {
        let wishlist = JSON.parse(localStorage.getItem('chamunda_wishlist')) || [];
        wishlist = wishlist.filter(w => w.name !== name);
        localStorage.setItem('chamunda_wishlist', JSON.stringify(wishlist));
        loadUserData();
    };

    // Initialize
    loadUserData();
});
