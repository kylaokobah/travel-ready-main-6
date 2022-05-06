import {
  Typography,
  Box,
  CircularProgress,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  Rating,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getUser, setUser } from 'modules/user';
import React, { useEffect, useState } from 'react';
import TravelHistoryForm from './TravelHistoryForm';
import {
  getTravelHistoryList,
  setTravelHistoryList,
} from 'modules/travelHistory';
import {
  delTravelHistory,
  getListTravelHistory,
  getSingleTravelHistory,
  updateTravelHistoryLikes,
} from 'db/repositories/travelHistory';
import { auth } from 'db';
import { setBackdrop } from 'modules/backdrop';
import { TravelHistoryData } from 'types';
import { getUserFromDB } from 'db/repositories/user';
import { grey, pink } from '@mui/material/colors';
import { isFound } from 'lib';
import {
  getPlacesSearchResult,
  setPlacesSearchResult,
} from 'modules/placesSearch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import { setCovidResult } from 'modules/covid';

interface TravelHistoryProps {
  open: boolean;
  handleClose: () => void;
  isPersonalOnly: boolean;
}

function TravelHistory(props: TravelHistoryProps) {
  const user = useAppSelector(getUser);
  const currentUser = auth.currentUser;
  const travelHistories = useAppSelector(
    props.isPersonalOnly ? getTravelHistoryList : getPlacesSearchResult
  );
  const dispatch = useAppDispatch();
  const [count, setCount] = useState(-1);
  const [openDel, setOpenDel] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedValue, setSelectedValue] = useState<TravelHistoryData | null>(
    null
  );
  const [isLikeProcessing, setIsLikeProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (user && count === -1) {
      setCount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (count >= 0) {
      updateTravelHistoryList(count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const updateTravelHistoryList = async (count: number) => {
    if (user) {
      if (count > 0) {
        dispatch(
          setTravelHistoryList(
            [...travelHistories].concat(
              await getListTravelHistory(
                user?.travel_histories,
                travelHistories[travelHistories.length - 1].createAt,
                3
              )
            )
          )
        );
      } else {
        dispatch(
          setTravelHistoryList(
            await getListTravelHistory(user?.travel_histories, null, 3)
          )
        );
      }
    }
  };

  const updateCount = () => {
    setCount(count + 3);
  };

  const handleDelete = async () => {
    if (currentUser && selectedValue) {
      dispatch(setBackdrop(true));

      await delTravelHistory(currentUser.uid, selectedValue);

      dispatch(setUser(await getUserFromDB(currentUser.uid)));

      const newTravelHistories = [...travelHistories];
      let index = newTravelHistories
        .map((obj) => obj.id)
        .indexOf(selectedValue.id);

      if (index !== -1) {
        newTravelHistories.splice(index, 1);
      }

      dispatch(setTravelHistoryList(newTravelHistories));

      setSelectedValue(null);
      setOpenDel(false);
      dispatch(setBackdrop(false));
    } else {
      alert('This request is not valid. Please try again.');
    }
  };

  const handleDeleteConfirm = (data: TravelHistoryData) => {
    setSelectedValue(data);
    setOpenDel(true);
  };

  const handleDeleteCancel = () => {
    setSelectedValue(null);
    setOpenDel(false);
  };

  const handleEdit = (data: TravelHistoryData) => {
    setSelectedValue(data);
    setOpenDetail(true);
  };

  const handleCloseEdit = () => {
    setOpenDetail(false);
    setSelectedValue(null);
    dispatch(setCovidResult([]));
  };

  const handleLike = async (data: TravelHistoryData) => {
    if (currentUser) {
      setIsLikeProcessing(data.id);
      await updateTravelHistoryLikes(currentUser.uid, data);
      let newPost = await getSingleTravelHistory(data.id);
      let index = travelHistories.map((obj) => obj.id).indexOf(data.id);
      if (index !== -1 && newPost) {
        let newList = [...travelHistories];
        newList[index] = newPost;
        dispatch(
          props.isPersonalOnly
            ? setTravelHistoryList(newList)
            : setPlacesSearchResult(newList)
        );
      }
      setIsLikeProcessing(null);
    } else {
      alert('user does not logged in.');
    }
  };

  return (
    <>
      <Box m={2}>
        {!user ? (
          <Box display='flex' justifyContent='center' m={1} p={1}>
            <CircularProgress color='inherit' />
          </Box>
        ) : props.isPersonalOnly && user.travel_histories?.length === 0 ? (
          <Typography variant='guideline' align='center'>
            You don't have any travel history. Please add places you visited!
          </Typography>
        ) : !props.isPersonalOnly && travelHistories?.length === 0 ? (
          <Typography variant='guideline' align='center'>
            There are no places available with the tag you provided.
          </Typography>
        ) : (
          <>
            <Grid
              container
              spacing={2}
              justifyContent='center'
              alignItems='center'
            >
              {travelHistories.map((travelHistory, i) => (
                <Grid item sm={12} md={6} lg={4} key={i}>
                  <Card>
                    <CardHeader
                      avatar={
                        <Avatar
                          alt='creator-profile'
                          src={travelHistory.photoURL}
                        />
                      }
                      action={
                        props.isPersonalOnly ? (
                          <>
                            <IconButton
                              aria-label='edit'
                              onClick={() => handleEdit(travelHistory)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label='delete'
                              onClick={() => handleDeleteConfirm(travelHistory)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            aria-label='detail'
                            onClick={() => handleEdit(travelHistory)}
                          >
                            <ArtTrackIcon />
                          </IconButton>
                        )
                      }
                      title={travelHistory.site}
                      subheader={travelHistory.createAt.toDate().toString()}
                    />
                    <CardMedia
                      component='img'
                      height='194'
                      image={travelHistory.image}
                      alt='media'
                    />
                    <CardContent sx={{ paddingBottom: 0 }}>
                      <Typography variant='body2' color='text.secondary'>
                        {travelHistory.description}
                      </Typography>

                      {travelHistory.tags.length > 0 ? (
                        <Paper
                          component='ul'
                          elevation={0}
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            margin: 0,
                            padding: 0,
                          }}
                        >
                          {travelHistory.tags.map((tag, i) => (
                            <li key={i}>
                              <Chip
                                label={tag}
                                sx={{ margin: 0.5 }}
                                color='primary'
                              />
                            </li>
                          ))}
                        </Paper>
                      ) : null}
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton
                        aria-label='add to favorites'
                        onClick={() => handleLike(travelHistory)}
                        style={{
                          color: isFound(
                            currentUser ? currentUser.uid : '',
                            travelHistory.likes
                          )
                            ? pink[400]
                            : grey[300],
                        }}
                        disabled={
                          isLikeProcessing === travelHistory.id ? true : false
                        }
                      >
                        <FavoriteIcon />
                        {travelHistory.likes.length > 0 ? (
                          <Typography variant='body2'>
                            +{travelHistory.likes.length}
                          </Typography>
                        ) : null}
                      </IconButton>
                      <Rating
                        name='rating'
                        value={travelHistory.rating}
                        readOnly
                        sx={{ paddingLeft: 1 }}
                      />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {props.isPersonalOnly ? (
              <Box mt={2} display='flex' justifyContent='center'>
                {count > user.travel_histories.length ? (
                  <Typography>
                    <Typography variant='guideline' align='center'>
                      This is the last travel history!
                    </Typography>
                  </Typography>
                ) : (
                  <IconButton onClick={updateCount}>
                    <ExpandMoreIcon />
                  </IconButton>
                )}
              </Box>
            ) : null}
          </>
        )}
      </Box>
      {props.open ? (
        <TravelHistoryForm
          open={props.open}
          handleClose={props.handleClose}
          isUpdate={false}
          isDetail={false}
          travelHistory={null}
        />
      ) : null}
      {openDetail ? (
        <TravelHistoryForm
          open={openDetail}
          handleClose={handleCloseEdit}
          isUpdate={true}
          isDetail={!props.isPersonalOnly}
          travelHistory={selectedValue}
        />
      ) : null}
      <Dialog open={openDel}>
        <DialogTitle>Are you sure you want to delete this history?</DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button onClick={handleDelete}>Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TravelHistory;
