import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import {withStyles} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import Alert from '@material-ui/lab/Alert';
import CircularProgress from "@material-ui/core/CircularProgress";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
            waitResult: false,
            statusPhrase: '',

            startLoad: false,

            disAll: false,
        }
    };

    handleInputText = (e) => {
        e.preventDefault();
        this.setState({inputText: e.target.value});
    };

    sendData = () => {

        this.setState({disAll: true, startLoad: true});

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const objectSent = {text: this.state.inputText};
        const body = JSON.stringify(objectSent);

        fetch('http://127.0.0.1:8000/elman/get/data'
            , {
                method: 'POST',
                headers: config.headers,
                body: body,
            })
            .then((res) => res.json())
            .then((data) => {
                console.log('response ',data);
                this.setState({startLoad: false});
                this.setState({waitResult: true, statusPhrase: data.status})
            }).finally(() =>{
                this.setState({disAll: false});
        })
    };

    handleClickSend = (e) => {
        e.preventDefault();
        this.setState({waitResult: !this.state.waitResult});
        this.sendData();
    };

    render() {
        const {classes} = this.props;

        const alerts = (<Collapse in={this.state.waitResult}>
            {
                this.state.statusPhrase === 'good' ?
                    <Alert severity="success">{'Хорошо'}</Alert>
                    : <Alert severity="error">{'Отрицательный'}</Alert>
            }
        </Collapse>);

        const circular = (<CircularProgress/>);

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Характер фразы
                    </Typography>

                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="phrase"
                            label="Введите фразу"
                            name="phrase"
                            autoComplete="phrase"
                            autoFocus
                            onChange={this.handleInputText}
                            disabled={this.state.disAll}
                        />

                        {
                            (() => {
                                if(this.state.startLoad){
                                   return (() => circular)();
                                }
                                else {
                                   return  (() => alerts)();
                                }
                            })()
                        }


                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={this.handleClickSend}
                            disabled={this.state.disAll}
                        >
                            Проверить
                        </Button>
                    </form>
                </div>
            </Container>
        )
    }
}

const useStyles = (theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});


export default withStyles(useStyles)(App);
