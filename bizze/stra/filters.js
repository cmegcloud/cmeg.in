document.addEventListener('DOMContentLoaded', () => {
    
    // UI Elements
    const searchInput = document.getElementById('global-search');
    const sortSelect = document.getElementById('sort-data');
    const dateFilter = document.getElementById('filter-date');
    const branchFilter = document.getElementById('filter-branch');
    const statusFilter = document.getElementById('filter-status');
    const therapistFilter = document.getElementById('filter-therapist');
    const revenueFilter = document.getElementById('filter-revenue');
    
    const applyBtn = document.getElementById('apply-filters-btn');
    const clearBtn = document.getElementById('clear-filters-btn');

    // Mock Dataset (In production, this is your Firestore data array)
    let currentData = []; 

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const sortBy = sortSelect.value;
        const selectedDate = dateFilter.value; // Format: YYYY-MM-DD
        const selectedBranch = branchFilter.value;
        const selectedStatus = statusFilter.value;
        const selectedTherapist = therapistFilter.value;
        const selectedRevenue = revenueFilter.value;

        // 1. Run Filters
        let filteredData = currentData.filter(item => {
            // Search Match (Check across multiple fields)
            const matchesSearch = !searchTerm || 
                (item.PatientName && item.PatientName.toLowerCase().includes(searchTerm)) ||
                (item.MobileNumber && item.MobileNumber.includes(searchTerm)) ||
                (item.TransactionID && item.TransactionID.toLowerCase().includes(searchTerm));

            // Exact Dropdown Matches
            const matchesDate = !selectedDate || item.Date === selectedDate;
            const matchesBranch = !selectedBranch || item.Branch === selectedBranch;
            const matchesStatus = !selectedStatus || item.Status === selectedStatus;
            const matchesTherapist = !selectedTherapist || item.Therapist === selectedTherapist;
            const matchesRevenue = !selectedRevenue || item.PaymentStatus === selectedRevenue;

            return matchesSearch && matchesDate && matchesBranch && matchesStatus && matchesTherapist && matchesRevenue;
        });

        // 2. Run Sorting
        filteredData.sort((a, b) => {
            if (sortBy === 'a-z') {
                return (a.PatientName || "").localeCompare(b.PatientName || "");
            } else if (sortBy === 'newest') {
                return new Date(b.CreatedAt) - new Date(a.CreatedAt);
            } else if (sortBy === 'oldest') {
                return new Date(a.CreatedAt) - new Date(b.CreatedAt);
            }
            return 0;
        });

        // 3. Render Output
        console.log("Filtered & Sorted Data:", filteredData);
        // Call your UI render function here, e.g., renderTable(filteredData);
    }

    // Event Listeners
    applyBtn?.addEventListener('click', applyFilters);
    
    // Live search (optional, triggers as the user types)
    searchInput?.addEventListener('input', () => {
        // Optional: Add debounce logic here to prevent too many re-renders
        applyFilters();
    });

    // Clear Filters
    clearBtn?.addEventListener('click', () => {
        searchInput.value = '';
        sortSelect.value = 'newest';
        dateFilter.value = '';
        branchFilter.value = '';
        statusFilter.value = '';
        therapistFilter.value = '';
        revenueFilter.value = '';
        
        applyFilters(); // Re-render with default data
    });
});
