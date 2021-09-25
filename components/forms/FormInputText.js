import TextField from '@mui/material/TextField'
import { Controller } from 'react-hook-form'
import React from 'react'
import Box from '@mui/material/Box'

export default function FormInputText({ name, label, control, type, errors }) {
    return <Controller
        name={name}
        control={control}
        render={
            ({ field: { onChange, value } }) => <Box pb={3}>
                <TextField
                    error={errors[name] && true}
                    helperText={errors[name]?.message}
                    onChange={onChange}
                    value={value}
                    label={label}
                    type={type ? type : 'text'}
                    fullWidth
                />
            </Box>
        }
    />
}