import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase'
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SearchIcon from '@material-ui/icons/Search';
import Grow from '@material-ui/core/Grow';
import Fade from '@material-ui/core/Fade';



import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import axios from "axios";


const useStyles = makeStyles((theme) => ({
  topBarPaper: {
    marginBottom: theme.spacing(2),
    height: 60,
    width: '100%',
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflow:"hidden"
  },
  barItems: {
    margin: theme.spacing(2),
  },
  editBar: {
    marginBottom: theme.spacing(2),
    height: 50,
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  searchBar: {
    marginBottom: theme.spacing(2),
    display: "flex",
    height: 50,
    alignItems: "center",
  },
  tableContainer: {
    width: '100%',
  },
  tableRow: {
    display: 'flex',
  },
  tableCellCheckbox: {
    padding: theme.spacing(1),
  },
  tableCellText: {
    padding: theme.spacing(1),
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start'
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}))


function TablePaginationActions(props){
  const classes = useStyles();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  //-----------------------------Pagination Handler-----------------------------------
  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0)
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count/rowsPerPage)-1));
  }

  //------------------------------Pagination Icons-------------------------------------
  return (
    <div className={classes.pagination}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

//---------------------------Pagination Action Props---------------------------------------
TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};


export default function Questions(props) {

  const classes = useStyles()
  const [searchValue, setSearchValue] = React.useState("")
  const [searchData, setSearchData] = React.useState(null)
  const [checkboxes, setCheckboxes] = React.useState([])
  const [showEditBar, setShowEditBar] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [deleteAllDialog, setDeleteAllDialog] = React.useState(false)
  const menuAnchorRef = React.useRef(null)

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect( ()=>{
    if (checkboxes.includes(true)) setShowEditBar(true)
    else setShowEditBar(false)
  }, [checkboxes])

  React.useEffect( ()=>{
    let temp = props.data.map(()=>{
      return false
    })
    setCheckboxes(temp)
  }, [props.data])

  React.useEffect( ()=>{
    if (searchValue === "") {
      setSearchData(null)
    }
    else {
      let temp = []
      props.data.forEach((val) => {
        let q = val.Question.toLowerCase()
        if (q.search(searchValue) !== -1) {
          temp.push(val)
        }
      })
      setSearchData(temp)
    }
  }, [searchValue, props.data])

  const handleDeleteButton = () => {
    let tempData = []
    let i = 0
    checkboxes.map( (val, idx) => {
      if (!val) {
        tempData.push(props.data[idx])
        tempData[i].Index=i
        i++
      }
      return null
    })
    props.setData(tempData)
    props.setDataChanged(true)
  }

  const handleFile = (e) => {
    var file = e.target.files[0]

    let formData = new FormData()
    formData.append('file', file)

    axios.post(`${process.env.REACT_APP_API}/process/csv`, formData)
    .then( res => {
      let newData = res.data.data
      let tempData = []
      let i = 0
      newData.forEach( (val) => {
        tempData.push(val)
        tempData[i].Index=i
        i++
      })
      props.data.forEach( (val) => {
        tempData.push(val)
        tempData[i].Index=i
        i++
      })
      props.setData(tempData)
      props.setDataChanged(true)
    })
  }

  const handleChangePage = (event, newPage) =>{
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) =>{
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  return (
    <React.Fragment>
      <Paper className={classes.topBarPaper}>
        <Typography variant='h5' className={classes.barItems}>Questions</Typography>
        <div style={{display:'flex', alignItems:'center'}}>
          <Button variant="contained" color="primary"
          onClick={()=>{props.setAddNewQuestion(true)}}>
          Add Question
          </Button>

          <IconButton className={classes.barItems} ref={menuAnchorRef} onClick={()=>setIsMenuOpen((prev)=>!prev)}>
          <MoreHorizIcon/>
          </IconButton>

          <Popper open={isMenuOpen} anchorEl={menuAnchorRef.current} transition>
          { ({TransitionProps, placement }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
            <Paper>
            <ClickAwayListener onClickAway={()=>{setIsMenuOpen(false)}}>
            <MenuList autoFocusItem={isMenuOpen}>
              <MenuItem button component="label">Upload Questions
              <input accept=".csv" type="file" name="file" style={{display: 'none'}} onChange={handleFile}/>
              </MenuItem>
              <MenuItem button onClick={()=>{setDeleteAllDialog(true)}}>Delete All</MenuItem>
            </MenuList>
            </ClickAwayListener>
            </Paper>
            </Grow>
          )}
          </Popper>
        </div>
      </Paper>

      { !showEditBar ?
      <Fade in={!showEditBar}>
        <Paper className={classes.searchBar}>
        <SearchIcon className={classes.barItems}/>
        <InputBase
        placeholder="Search questions"
        onChange={(e)=>{setSearchValue(e.target.value.toLowerCase())}}
        value={searchValue}
        />
        </Paper>
      </Fade>
      :
      <Fade in={showEditBar}>
        <div className={classes.editBar}>
          <Button variant="contained" className={classes.button}
          onClick={handleDeleteButton}>
          Delete
          </Button>
          <Button variant="contained" className={classes.button}
          onClick={ () => setCheckboxes(checkboxes.map(() => (false))) }
          >
          Cancel
          </Button>
        </div>
      </Fade>
      }

      {/* Table for data */}
      <Paper variant="outlined" className={classes.tableContainer}>
        <Table aria-label="simple table">
          <TableBody>
            {(rowsPerPage > 0
              ? (searchData
                ? searchData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : props.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) )
              : (searchData ? searchData : props.data)
            ).map((row) => (
              <TableRow key={row.Index} className={classes.tableRow}>
                <TableCell className={classes.tableCellCheckbox}>
                  <Checkbox
                    checked={Boolean(checkboxes[row.Index])}
                    onChange={(e)=>{
                      const temp = [...checkboxes]
                      temp[row.Index] = e.target.checked
                      setCheckboxes(temp)
                    }}
                  />
                </TableCell>
                <TableCell className={classes.tableCellText} component="th" scope="row">
                  <ButtonBase disableTouchRipple disableRipple
                  onClick={()=>{props.setSelectedIndex(row.Index)}}>
                  <Typography align='left'>{row.Question}</Typography>
                  </ButtonBase>
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, { label: 'All', value: -1 }]}
                colSpan={2}
                count={searchData ? searchData.length : props.data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>

      {/* Dialogbox for deleting all */}
      <Dialog open={deleteAllDialog} onClose={()=>{setDeleteAllDialog(false)}}>
        <DialogTitle id="alert-dialog-title">{"Delete all questions and answers?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once deleted, questions and answers cannot be retrieved.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={()=>{
            props.setData([])
            props.setDataChanged(true)
            setDeleteAllDialog(false)
          }}>
            Delete All
          </Button>
          <Button color="primary" autoFocus
          onClick={()=>{setDeleteAllDialog(false)}}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

    </React.Fragment>
  )
}