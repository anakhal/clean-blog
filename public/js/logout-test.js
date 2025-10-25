// Simple manual test for logout functionality
// Run this in browser console when logged in

console.log('Testing logout functionality...');

// Test 1: Check if logout form exists
const logoutForm = document.getElementById('logoutForm');
if (logoutForm) {
    console.log('✅ Logout form found');
    console.log('Form action:', logoutForm.action);
    console.log('Form method:', logoutForm.method);
} else {
    console.log('❌ Logout form not found');
}

// Test 2: Check if logout function exists
if (typeof handleLogout === 'function') {
    console.log('✅ handleLogout function exists');
} else {
    console.log('❌ handleLogout function not found');
}

// Test 3: Simulate logout (only run this when you want to actually logout)
// handleLogout({ preventDefault: () => {} });

console.log('Logout test completed. Check above for any ❌ errors.');