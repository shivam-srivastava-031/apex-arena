export const fetchTournaments = async (filters?: { gameType?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.gameType) params.append('gameType', filters.gameType);
    if (filters?.status) params.append('status', filters.status);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/tournaments?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch tournaments');
    }
    return response.json();
};

export const fetchPublishedTournaments = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/tournaments/published/list`);
    if (!response.ok) {
        throw new Error('Failed to fetch published tournaments');
    }
    return response.json();
};

export const createRazorpayOrder = async (tournamentId: string, selectedTeamSize: number, players: any[]) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/registrations/book-slot`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tournamentId, selectedTeamSize, players })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking order');
    }
    return data.data;
};

export const confirmPayment = async (paymentId: string, paymentStatus: 'SUCCESS' | 'FAILED', providerTransactionId?: string, signature?: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/registrations/confirm-payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            paymentId,
            paymentStatus,
            providerTransactionId,
            metadata: { razorpay_signature: signature }
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Failed to confirm payment');
    }
    return data.data;
};

export const fetchTeamById = async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/teams/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch team');
    return data.data;
};

export const addTeamMember = async (teamId: string, memberData: { username: string }) => {
    const token = localStorage.getItem('token');
    // First lookup user by username using the user search API (needs to be built or integrated)
    // For now we assume we pass the full memberData directly to the addMember backend 
    const response = await fetch(`${import.meta.env.VITE_API_URL}/teams/${teamId}/members`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(memberData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to add member');
    return data.data;
};

export const removeTeamMember = async (teamId: string, memberId: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/teams/${teamId}/members/${memberId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to remove member');
    return data.data;
};

export const fetchMyTeams = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/teams/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch my teams');
    return data.data;
};

export const createTeam = async (teamData: { name: string; tag: string; description?: string; members: any[] }) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/teams`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(teamData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create team');
    return data.data;
};

export const updateProfile = async (profileData: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update profile');
    return data.data;
};

export const fetchMyRegistrations = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/registrations/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch my registrations');
    return data.data;
};

export const fetchMyNotifications = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch notifications');
    return data.data;
};

export const markNotificationRead = async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to mark as read');
    return data.data;
};

export const markAllNotificationsRead = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to mark all as read');
    return data.data;
};

export const createNotification = async (notificationData: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(notificationData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create notification');
    return data.data;
};
export const fetchAdminStats = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch admin stats');
    return data.data;
};

export const fetchAllTournaments = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/tournaments`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch tournaments');
    return data.data;
};

export const createTournament = async (tournamentData: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(tournamentData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create tournament');
    return data.data;
};

export const deleteTournament = async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/tournaments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to delete tournament');
    return data.data;
};

export const fetchBracketMatches = async (tournamentId: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/tournaments/${tournamentId}/bracket`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch bracket');
    return data.data;
};
