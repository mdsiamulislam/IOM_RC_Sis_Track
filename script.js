document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://script.google.com/macros/s/AKfycbyY9qAq2MNe5N1nUQ2Q8eiUbNFV2EAnrMxzhP51thQFzNNJIRprMYdGkDeTsLmxILxa/exec";

    const loadingElement = document.getElementById("loading");
    const leaderboardBody = document.getElementById("leaderboard-data");
    const updatesList = document.getElementById("updates-list");

    async function fetchData() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            loadingElement.style.display = "none"; // লোডিং অফ

            if (!data || !Array.isArray(data)) {
                throw new Error("Invalid data format");
            }

            let leaderboard = {};
            let dailyUpdates = [];

            data.forEach(entry => {
                let name = entry["👤  নাম"]?.trim() || "অজানা";
                let activeTime = entry["💬   গ্রুপে মোট কতক্ষণ সক্রিয় ছিলেন?  (গ্রুপে আগত সমস্যা সমাধান এবং প্রয়োজনীয় রিপ্লাই প্রদান, দায়িত্বে থাকা জিম্মাদারি আঞ্জাম দেওয়া)"]?.trim() || "❌ নেই";
                let role = entry["📚   আপনি MR/ CR/ Management এর দায়িত্বে রয়েছেন?"]?.trim() || "❌ নেই";
                let courses = entry["📚   আপনি কোন কোন কোর্সের জিম্মাদার?  "]?.trim() || "❌ নেই";
                let timestamp = entry["Timestamp"]?.trim() || "❌ নেই";

                // Timestamp থেকে তারিখ আলাদা করা
                let date = new Date(timestamp).toLocaleDateString("en-GB");

                // যদি নামটি লিডারবোর্ডে না থাকে, তাহলে সেটাকে শুরুতে 0 করে রাখি
                if (!leaderboard[name]) {
                    leaderboard[name] = { name, activeTime: 0, role };
                }

                // Extract hours from activeTime
                let hours = 0;
                if (activeTime.includes("১ ঘণ্টা+")) hours = 1;
                if (activeTime.includes("২ ঘণ্টা+")) hours = 2;
                if (activeTime.includes("৩ ঘণ্টা+")) hours = 3;
                if (activeTime.includes("৪ ঘণ্টা+")) hours = 4;
                if (activeTime.includes("৫ ঘণ্টা+")) hours = 5;
                if (activeTime.includes("৬ ঘণ্টা+")) hours = 6;
                if (activeTime.includes("৭ ঘণ্টা+")) hours = 7;
                if (activeTime.includes("৮ ঘণ্টা+")) hours = 8;
                if (activeTime.includes("৯ ঘণ্টা+")) hours = 9;
                if (activeTime.includes("১০ ঘণ্টা+")) hours = 10;

                // মোট সময় যোগ করা
                leaderboard[name].activeTime += hours;

                // দৈনিক আপডেট লিস্ট (Timestamp সহ)
                dailyUpdates.push(`📅 ${date} | ${name} 🕒 ${activeTime} 📚 ${courses}`);
            });

            // লিডারবোর্ড সাজানো (সর্বোচ্চ সক্রিয় ব্যক্তিকে উপরে দেখানো)
            let sortedLeaderboard = Object.values(leaderboard).sort((a, b) => b.activeTime - a.activeTime);

            // লিডারবোর্ড HTML এ যোগ করা
            leaderboardBody.innerHTML = "";
            sortedLeaderboard.forEach(user => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.activeTime} ঘন্টা</td>
                    <td>${user.role}</td> <!-- নতুন কলাম -->
                `;
                leaderboardBody.appendChild(row);
            });

            // দৈনিক আপডেট দেখানো
            updatesList.innerHTML = "";
            dailyUpdates.forEach(update => {
                let li = document.createElement("li");
                li.textContent = update;
                updatesList.appendChild(li);
            });

        } catch (error) {
            loadingElement.textContent = "❌ ডেটা লোড করতে সমস্যা হচ্ছে!";
            console.error("Error fetching data:", error);
        }
    }

    fetchData();
});
