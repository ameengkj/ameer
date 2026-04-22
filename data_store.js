const STORAGE_KEY = 'malab_data_v1';

const defaultState = {
    students: [],
    logs: [],
    attendance: {}
};

export const DataStore = {
    save(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    load() {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : defaultState;
    },

    merge(incoming) {
        const current = this.load();
        
        if (!incoming.students) return false;


        incoming.students.forEach(newStu => {
            const idx = current.students.findIndex(s => s.nid === newStu.nid);
            if (idx !== -1) {
                current.students[idx] = { ...current.students[idx], ...newStu };
            } else {
                current.students.push(newStu);
            }
        });


        if (Array.isArray(incoming.logs)) {
            incoming.logs.forEach(log => {
                const exists = current.logs.some(l => 
                    l.studentId === log.studentId && l.date === log.date && l.ayahTo === log.ayahTo
                );
                if (!exists) current.logs.push(log);
            });
        }


        if (incoming.attendance) {
            current.attendance = { ...current.attendance, ...incoming.attendance };
        }

        this.save(current);
        return true;
    },

    findStudentByNid(nid) {
        const data = this.load();
        const student = data.students.find(s => s.nid === nid);
        if (!student) return null;

        const studentLogs = data.logs.filter(l => l.studentId === student.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));


        let attended = 0;
        let total = 0;
        Object.values(data.attendance).forEach(day => {
            if (day[student.id]) {
                total++;
                if (day[student.id] === 'present') attended++;
            }
        });

        return {
            ...student,
            logs: studentLogs,
            stats: {
                attendanceRate: total > 0 ? Math.round((attended / total) * 100) : '0',
                totalSessions: total
            }
        };
    }
};
