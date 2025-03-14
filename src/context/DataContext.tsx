import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Alert, Report, Task, Ticket, Team } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
    reports: Report[];
    tasks: Task[];
    tickets: Ticket[];
    teams: Team[];
    alerts: Alert[];

    addReport: (report: Omit<Report, 'id' | 'createdAt'>) => Promise<void>;
    deleteReport: (id: string) => Promise<void>;
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
    updateTaskStatus: (id: string, status: Task['status']) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => Promise<void>;
    closeTicket: (id: string) => Promise<void>;
    addTeam: (team: Omit<Team, 'id'>) => Promise<void>;
    addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'read' | 'user'> & { user: User }) => Promise<void>;
    markAlertAsRead: (id: string) => Promise<void>;
    sendReportToAdmin: (reportId: string) => Promise<void>;
    getAdminReceivedReports: () => Report[];
    getUsers: () => Promise<User[]>;
    getUserAlerts: (userId: string) => Alert[];
    deleteUser: (userId: string) => Promise<void>;
    deleteAlert: (alertId: string) => Promise<void>;
    resendAlert: (alert: Alert) => Promise<void>;
    updateAlert: (alert: Alert) => Promise<void>;
}

const DataContext = createContext<DataContextType>({
    reports: [],
    tasks: [],
    tickets: [],
    teams: [],
    alerts: [],
    addReport: async () => { },
    deleteReport: async () => { },
    addTask: async () => { },
    updateTaskStatus: async () => { },
    deleteTask: async () => { },
    addTicket: async () => { },
    closeTicket: async () => { },
    addTeam: async () => { },
    addAlert: async () => { },
    markAlertAsRead: async () => { },
    sendReportToAdmin: async () => { },
    getAdminReceivedReports: () => [],
    getUsers: async () => [],
    getUserAlerts: () => [],
    deleteUser: async () => { },
    deleteAlert: async () => { },
    resendAlert: async () => { },
    updateAlert: async () => { },
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if (user) {
            const userId = user.id;
            const storedReports = localStorage.getItem(`delvind_reports_${userId}`);
            const storedTasks = localStorage.getItem(`delvind_tasks_${userId}`);
            const storedTickets = localStorage.getItem(`delvind_tickets_${userId}`);
            const storedTeams = localStorage.getItem(`delvind_teams_${userId}`);
            const storedAlerts = localStorage.getItem(`delvind_alerts_${userId}`);
            const storedUsers = localStorage.getItem('delvind_users');

            if (storedReports) setReports(JSON.parse(storedReports));
            if (storedTasks) setTasks(JSON.parse(storedTasks));
            if (storedTickets) setTickets(JSON.parse(storedTickets));
            if (storedTeams) setTeams(JSON.parse(storedTeams));
            if (storedAlerts) setAlerts(JSON.parse(storedAlerts));
            if (storedUsers) setUsers(JSON.parse(storedUsers) || []);
        } else {
            setReports([]);
            setTasks([]);
            setTickets([]);
            setTeams([]);
            setAlerts([]);
            setUsers([]);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            const userId = user.id;
            localStorage.setItem(`delvind_reports_${userId}`, JSON.stringify(reports));
            localStorage.setItem(`delvind_tasks_${userId}`, JSON.stringify(tasks));
            localStorage.setItem(`delvind_tickets_${userId}`, JSON.stringify(tickets));
            localStorage.setItem(`delvind_teams_${userId}`, JSON.stringify(teams));
            localStorage.setItem(`delvind_alerts_${userId}`, JSON.stringify(alerts));
            localStorage.setItem('delvind_users', JSON.stringify(users));
        }
    }, [reports, tasks, tickets, teams, alerts, user, users]);

    const addReport = async (report: Omit<Report, 'id' | 'createdAt'>) => {
        if (!user) return;

        const newReport: Report = {
            ...report,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };

        setReports((prev) => [newReport, ...prev]);
    };

    const deleteReport = async (id: string) => {
        if (!user) return;
        setReports((prev) => prev.filter((report) => report.id !== id));
    };

    const sendReportToAdmin = async (reportId: string) => {
        if (!user) return;

        setReports((prevReports) =>
            prevReports.map((report) => (report.id === reportId ? { ...report, sentToAdmin: true } : report))
        );

        localStorage.setItem(`delvind_reports_${user.id}`, JSON.stringify(reports));
    };

    const getAdminReceivedReports = () => {
        return reports.filter((report) => report.sentToAdmin);
    };

    const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
        if (!user) return;

        const newTask: Task = {
            ...task,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };

        setTasks((prev) => [newTask, ...prev]);
    };

    const updateTaskStatus = async (id: string, status: Task['status']) => {
        if (!user) return;
        setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)));
    };

    const deleteTask = async (id: string) => {
        if (!user) return;
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const addTicket = async (ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => {
        if (!user) return;

        const newTicket: Ticket = {
            ...ticket,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            status: 'open',
        };

        setTickets((prev) => [newTicket, ...prev]);
    };

    const addTeam = async (team: Omit<Team, 'id'>) => {
        if (!user) return;

        const newTeam: Team = {
            ...team,
            id: Date.now().toString(),
        };

        setTeams((prev) => [newTeam, ...prev]);

        const alertPromises = team.members.map(async (memberId) => {
            try {
                const memberUser = users.find((u) => u.id === memberId);

                if (!memberUser) {
                    console.error(`Usuário com ID ${memberId} não encontrado.`);
                    return;
                }

                await addAlert({
                    message: `Você foi adicionado à equipe ${team.name}.`,
                    userId: memberId,
                    user: memberUser,
                });
            } catch (error) {
                console.error(`Erro ao enviar alerta para ${memberId}:`, error);
            }
        });

        await Promise.all(alertPromises);
    };

    const closeTicket = async (id: string) => {
        if (!user) return;
        setTickets((prev) => prev.map((ticket) => (ticket.id === id ? { ...ticket, status:'closed' } : ticket)));
};

const addAlert = async (alert: Omit<Alert, 'id' | 'createdAt' | 'read' | 'user'> & { user: User }) => {
    if (!alert.userId) return;

    const newAlert: Alert = {
        ...alert,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        read: false,
    };

    const storedAlerts = localStorage.getItem(`delvind_alerts_${alert.userId}`);
    const userAlerts: Alert[] = storedAlerts ? JSON.parse(storedAlerts) : [];
    userAlerts.push(newAlert);
    localStorage.setItem(`delvind_alerts_${alert.userId}`, JSON.stringify(userAlerts));
};

const markAlertAsRead = async (id: string) => {
    if (!user) return;
    const storedAlerts = localStorage.getItem(`delvind_alerts_${user.id}`);
    if (storedAlerts) {
        const userAlerts: Alert[] = JSON.parse(storedAlerts).map((alert: Alert) =>
            alert.id === id ? { ...alert, read: true } : alert
        );
        localStorage.setItem(`delvind_alerts_${user.id}`, JSON.stringify(userAlerts));
    }
};

const getUserAlerts = (userId: string): Alert[] => {
    const storedAlerts = localStorage.getItem(`delvind_alerts_${userId}`);
    return storedAlerts ? JSON.parse(storedAlerts) : [];
};

const getUsers = async (): Promise<User[]> => {
    try {
        const storedUsers = localStorage.getItem('delvind_users');
        if (storedUsers) {
            return JSON.parse(storedUsers);
        } else {
            return [];
        }
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
    }
};

const deleteUser = async (userId: string): Promise<void> => {
    let storedUsers = JSON.parse(localStorage.getItem('delvind_users') || '[]');
    console.log('Antes da exclusão:', storedUsers);

    storedUsers = storedUsers.filter((user: any) => user.id !== userId);
    console.log('Depois da exclusão:', storedUsers);

    localStorage.setItem('delvind_users', JSON.stringify(storedUsers));
};

const deleteAlert = async (alertId: string) => {
  if (!user) return;

  setAlerts((prevAlerts) => {
      const updatedAlerts = prevAlerts.filter((alert) => alert.id !== alertId);
      localStorage.setItem(`delvind_alerts_${user.id}`, JSON.stringify(updatedAlerts));
      return updatedAlerts;
  });
};


const resendAlert = async (alert: Alert): Promise<void> => {
  if (!user) return;
  await addAlert({ ...alert, user: alert.user });
};

const updateAlert = async (alert: Alert): Promise<void> => {
    if (!user) return;
    const storedAlerts = localStorage.getItem(`delvind_alerts_${alert.userId}`);
    if (storedAlerts) {
        const userAlerts: Alert[] = JSON.parse(storedAlerts).map((a: Alert) =>
            a.id === alert.id ? alert : a
        );
        localStorage.setItem(`delvind_alerts_${alert.userId}`, JSON.stringify(userAlerts));
    }
};

return (
    <DataContext.Provider
        value={{
            reports,
            tasks,
            tickets,
            teams,
            alerts,
            addReport,
            deleteReport,
            addTask,
            updateTaskStatus,
            deleteTask,
            addTicket,
            closeTicket,
            addTeam,
            addAlert,
            markAlertAsRead,
            sendReportToAdmin,
            getAdminReceivedReports,
            getUsers,
            getUserAlerts,
            deleteUser,
            deleteAlert,
            resendAlert,
            updateAlert,
        }}
    >
        {children}
    </DataContext.Provider>
);
};