import React from 'react'
import Avatar from '@mui/material/Avatar';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import TextField from '@mui/material/TextField';

export default function Comment() {
  return (
    <div className='my-8'>
        <h3 className="font-thin text-3xl">
            2 Comment
        </h3>

        {/*Comment 1*/}
        <div className='mt-5 w-[50%] grid grid-cols-[12%_88%] items-center'>
            <Avatar
                alt="Remy Sharp"
                src="/static/images/avatar/1.jpg"
                sx={{
                    width: 50,
                    height: 50,
                }}
            />
            <div>
                <h5 className='font-semibold'>Rose Gold</h5>
                <p>Awesome! The plot twist really gave me chills and tears.</p>
                <div className='flex items-center mt-1'>
                <ThumbUpIcon
                    sx={{
                        width: 17,
                        height: 17,
                    }}
                />
                <span className='ml-1 text-sm'>12</span>
                <ThumbDownIcon
                    sx={{
                        width: 17,
                        height: 17,
                        marginLeft: 1,
                    }}
                />
                <ModeCommentIcon
                    sx={{
                        width: 17,
                        height: 17,
                        marginLeft: 1,
                    }}/>
                </div>
            </div>
        </div>

        {/*Comment 2*/}
        <div className='mt-5 w-[50%] grid grid-cols-[12%_88%] items-center'>
            <Avatar
                alt="Remy Sharp"
                src="/static/images/avatar/1.jpg"
                sx={{
                    width: 50,
                    height: 50,
                }}
            />
            <div>
                <h5 className='font-semibold'>Rose Gold</h5>
                <p>Awesome! The plot twist really gave me chills and tears.</p>
                <div className='flex items-center mt-1'>
                <ThumbUpIcon
                    sx={{
                        width: 17,
                        height: 17,
                    }}
                />
                <span className='ml-1 text-sm'>12</span>
                <ThumbDownIcon
                    sx={{
                        width: 17,
                        height: 17,
                        marginLeft: 1,
                    }}
                />
                <ModeCommentIcon
                    sx={{
                        width: 17,
                        height: 17,
                        marginLeft: 1,
                    }}/>
                </div>
            </div>
        </div>

        {/*Comment 3*/}
        <div className='mt-5 w-[50%] grid grid-cols-[12%_88%] items-center'>
            <Avatar
                alt="Remy Sharp"
                src="/static/images/avatar/1.jpg"
                sx={{
                    width: 50,
                    height: 50,
                }}
            />
            <div>
                <h5 className='font-semibold'>Rose Gold</h5>
                <p>Awesome! The plot twist really gave me chills and tears.</p>
                <div className='flex items-center mt-1'>
                <ThumbUpIcon
                    sx={{
                        width: 17,
                        height: 17,
                    }}
                />
                <span className='ml-1 text-sm'>12</span>
                <ThumbDownIcon
                    sx={{
                        width: 17,
                        height: 17,
                        marginLeft: 1,
                    }}
                />
                <ModeCommentIcon
                    sx={{
                        width: 17,
                        height: 17,
                        marginLeft: 1,
                    }}/>
                </div>
            </div>
        </div>

        {/*Comment 3*/}
        <div className='mt-5 w-[50%] grid grid-cols-[12%_88%] items-center'>
            <Avatar
                alt="Remy Sharp"
                src="/static/images/avatar/1.jpg"
                sx={{
                    width: 35,
                    height: 35,
                }}
            />
            <TextField
                id="standard-helperText"
                defaultValue="Add a comment..."
                variant="standard"
                sx={{
                    '& .MuiInputBase-input': {
                        color: 'white', // Change the input text color to white
                        backgroundColor: 'transparent',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'white', // Default border color
                        },
                        '&:hover fieldset': {
                            borderColor: 'white', // Border color on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'red !important', // Border color when focused
                        },
                    },
                    '& .MuiInput-underline:before': {
                        borderBottom: '1px solid white', // Default underline color
                    },
                    '& .MuiInput-underline:after': {
                        borderBottom: '2px solid red', // Underline color when focused
                    },
                }}
            />

        </div>
    </div>
  )
}
