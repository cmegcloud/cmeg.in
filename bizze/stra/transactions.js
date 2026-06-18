import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // Session Verification
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const userBranch = sessionStorage.getItem("userBranch") || "B1"; 

    if (isLoggedIn !== "true") {
        window.location.href = "login.html";
        return;
    }

    const saveBtn = document.getElementById('save-transaction-btn');
    const transactionIdBadge = document.getElementById('transaction-id-badge');
    
    // Auto-generate a mock Transaction ID based on current timestamp for uniqueness
    // In a production environment, you might query the last transaction ID and increment it
    const generatedTxId = `TRN${Date.now().toString().slice(-5)}`;
    transactionIdBadge.innerText = `TRN: ${generatedTxId}`;

    saveBtn.addEventListener('click', async () => {
        const voucherType = document.getElementById('voucher-type').value;
        const ledgerIn = document.getElementById('ledger-in').value;
        const ledgerOut = document.getElementById('ledger-out').value;
        const amount = document.getElementById('transaction-amount').value;
        const narration = document.getElementById('transaction-narration').value;

        if (!amount || !ledgerIn || !ledgerOut) {
            alert("Please fill in the Ledgers and Amount.");
            return;
        }

        saveBtn.innerText = "Saving...";
        saveBtn.disabled = true;

        // Structured exactly as per your TRANSACTIONS spec
        const transactionData = {
            TransactionID: generatedTxId,
            TransactionDate: serverTimestamp(),
            VoucherType: voucherType,
            LedgerIn: ledgerIn,
            LedgerOut: ledgerOut,
            Amount: parseFloat(amount),
            Narration: narration,
            Branch: userBranch // Pulled from the active user's session
        };

        try {
            await addDoc(collection(db, "transactions"), transactionData);
            alert(`Success! Transaction ${generatedTxId} saved.`);
            
            // Reset form
            document.getElementById('transaction-amount').value = '';
            document.getElementById('transaction-narration').value = '';
            
            // Generate next ID
            const nextTxId = `TRN${Date.now().toString().slice(-5)}`;
            transactionIdBadge.innerText = `TRN: ${nextTxId}`;
            
        } catch (error) {
            console.error("Error saving transaction: ", error);
            alert("Failed to save transaction.");
        } finally {
            saveBtn.innerText = "Save Transaction";
            saveBtn.disabled = false;
        }
    });
});
