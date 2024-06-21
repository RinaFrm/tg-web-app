import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

export const getUsers = createAsyncThunk(
    'users/getUsers',
    async () => {
        const response = await axios.get('https://eco.almazor.co/users');
        return response.data;
    }
)

export const getUser = createAsyncThunk(
    'user/getUser',
    async (username) => {
        const response = await axios.get(`https://eco.almazor.co/users/${username}`)
        return response.data;
    }
)

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        currentUser: {
            username: 'test_user',
            points: null,
            farm_params: {
                energy: null,
                max_energy: 1000,
                points_per_click: 1,
                recovery_time: '1h',
                recovery_start_time: 0,
                status: "Full",
            },
            autofarm_params: {
                farm_time: '8h',
                auto_farm_points: 0,
                farm_points_per_min: 2,
                farm_time_start: 0,
                full_bar_multiplier: 1.25,
                status: "",
            },
            created_at: '',
            updated_at: '',
            referrals: []
        },
        loadingUsers: 'idle',
        loadingUser: 'idle'
    },
    reducers: {
        addPoints: (state, action) => {
            state.currentUser.points = action.payload;
        },
        updateUsername: (state, action) => {
            state.currentUser.username = action.payload;
        },
        updateEnergy: (state, action) => {
            state.currentUser.farm_params.energy = action.payload;
        },
        updateSliceAutofarmStatus: (state, action) => {
            state.currentUser.autofarm_params.status = action.payload;
        },
        // updateFarmParams: (state, action) => {
        //     state.users.farm_params = {...state.users.farm_params, ...action.payload};
        // },
        // updateAutofarmParams: (state, action) => {
        //     state.users.autofarm_params = {...state.users.autofarm_params, ...action.payload};
        // },
        addReferral: (state, action) => {
            state.users.referrals.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.loadingUsers = 'loading';
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loadingUsers = 'success';
                state.users = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loadingUsers = 'failed';
                state.error = action.error;
            })
            .addCase(getUser.pending, (state) => {
                state.loadingUser = 'loading';
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loadingUser = 'success';
                state.currentUser = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loadingUser = 'failed';
                state.error = action.payload;
            })
    },
})

export const {
    addPoints,
    updateUsername,
    updateEnergy,
    updateSliceAutofarmStatus,
    // updateAutofarmParams,
    // updateFarmParams,
    addReferral,
} = usersSlice.actions;
export default usersSlice.reducer;