
// ---------------------------------------------
// Helper: convert "HH:MM" to minutes
// ---------------------------------------------
function timeToMinutes(timeStr) {
    if (!timeStr) throw new Error("Time value missing");

    const parts = timeStr.split(":");
    if (parts.length !== 2) throw new Error("Invalid time format");

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    if (isNaN(hours) || isNaN(minutes)) {
        throw new Error("Invalid numeric time value");
    }

    return hours * 60 + minutes;
}

// ---------------------------------------------
// Main attendance processing function
// ---------------------------------------------
function processAttendance(input) {
    // Create a *safe copy* of the input as required
    const data = { ...input };

    let status = "complete";
    let totalWorkingMinutes = 0;
    let overtimeMinutes = 0;
    let note = "";
    let errorMessage = "";

    try {
        // ---------------------------------------------
        // 1. Validate check-in/check-out
        // ---------------------------------------------
        if (!data.checkIn || !data.checkOut) {
            status = "incomplete";
            note = "Missing check-in or check-out";
            return {
                employeeId: data.employeeId,
                date: data.date,
                status,
                totalWorkingMinutes: 0,
                overtimeMinutes: 0,
                note,
                errorMessage: ""
            };
        }

        // Convert times safely
        const checkInMin = timeToMinutes(data.checkIn);
        const checkOutMin = timeToMinutes(data.checkOut);

        // ---------------------------------------------
        // 2. Break duration
        // ---------------------------------------------
        let breakMinutes = 0;

        if (data.breakStart && data.breakEnd) {
            // Use actual break duration
            const bStart = timeToMinutes(data.breakStart);
            const bEnd = timeToMinutes(data.breakEnd);

            breakMinutes = bEnd - bStart;
            if (breakMinutes < 0) throw new Error("Break end time before start time");
        }
        else if (data.breakStart && !data.breakEnd) {
            // Default break 30 minutes
            breakMinutes = 30;
            note = "Break end missing → default 30 minutes applied";
        }

        // ---------------------------------------------
        // 3. Total working time
        // ---------------------------------------------
        totalWorkingMinutes = (checkOutMin - checkInMin) - breakMinutes;

        if (totalWorkingMinutes < 0) {
            status = "invalid";
            note = "Calculated working time is negative";
            totalWorkingMinutes = 0;
            return {
                employeeId: data.employeeId,
                date: data.date,
                status,
                totalWorkingMinutes,
                overtimeMinutes,
                note,
                errorMessage
            };
        }

        // ---------------------------------------------
        // 4. Overtime calculation
        // ---------------------------------------------
        if (data.overtimeApproved === true && totalWorkingMinutes > 480) {
            overtimeMinutes = totalWorkingMinutes - 480;
        }

        note = note || "Processed successfully";
    }
    catch (err) {
        status = "error";
        note = "An error occurred during processing";
        errorMessage = err.message;
    }
    finally {
        console.log("Attendance processed successfully");
    }

    // ---------------------------------------------
    // Final summary
    // ---------------------------------------------
    return {
        employeeId: data.employeeId,
        date: data.date,
        status,
        totalWorkingMinutes,
        overtimeMinutes,
        note,
        errorMessage
    };
}

// ---------------------------------------------
// Example usage
// ---------------------------------------------
const result = processAttendance({
    employeeId: "EMP102",
    date: "2025-02-14",
    checkIn: "09:00",
    checkOut: "18:30",
    breakStart: "13:00",
    breakEnd: "13:45",
    overtimeApproved: true
});

console.log(result);

