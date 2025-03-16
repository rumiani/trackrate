export function getFormatPriceHistoryData(
    priceHistory: { price: number; createdAt: Date }[],
    period: string
  ) {
    
    if (period === "day") {
      const labels = priceHistory.map((entry) =>
        new Date(entry.createdAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      const data = priceHistory.map((entry) => entry.price);      
      return { labels, data };
    } else if (period === "week") {
      const groupedData = priceHistory.reduce(
        (acc: Record<string, { price: number; dateObj: Date }>, entry) => {
          const dateObj = new Date(entry.createdAt);
          const dateKey = dateObj.toISOString().split("T")[0]; // format: "2024-02-13"
  
          if (!acc[dateKey] || entry.price > acc[dateKey].price) {
            acc[dateKey] = { price: entry.price, dateObj };
          }
  
          return acc;
        },
        {}
      );
      const labels = Object.values(groupedData).map(({ dateObj }) =>
        dateObj.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
      const data = Object.values(groupedData).map(({ price }) => price);
      return { data, labels };
    } else if (period === "month") {
      const groupedData = priceHistory.reduce(
        (acc: Record<string, { price: number; dateObj: Date }>, entry) => {
          const dateObj = new Date(entry.createdAt);
          const dateKey = dateObj.toISOString().split("T")[0]; // format: "2024-02-13"
  
          if (!acc[dateKey] || entry.price > acc[dateKey].price) {
            acc[dateKey] = { price: entry.price, dateObj };
          }
  
          return acc;
        },
        {}
      );
      const labels = Object.values(groupedData).map(({ dateObj }) =>
        dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      );
      const data = Object.values(groupedData).map(({ price }) => price);
      return { data, labels };
    } else {
      const groupedData = priceHistory.reduce(
        (acc: Record<string, { price: number; dateObj: Date }>, entry) => {
          const dateObj = new Date(entry.createdAt);
          // Calculate the week number for the entry
          const year = dateObj.getFullYear();
          const month = dateObj.getMonth();
          const weekNumber = Math.floor(dateObj.getDate() / 7); // This gives us the week number within the month
  
          // Use the week number to group the data
          const key = `${year}-${month + 1}-${weekNumber}`; // e.g., "2024-2-3" (Year-Month-Week)
  
          if (!acc[key] || entry.price > acc[key].price) {
            acc[key] = { price: entry.price, dateObj };
          }
  
          return acc;
        },
        {}
      );
      const labels = Object.values(groupedData).map(({ dateObj }) =>
        dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      );
      const data = Object.values(groupedData).map(({ price }) => price);
      return { data, labels };
    }
  }
  