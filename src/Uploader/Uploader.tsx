// Generated with util/create-component.js
import React from "react";
import { FilePond } from 'react-filepond';

import "./Uploader.css";
import 'filepond/dist/filepond.min.css'

const DEFAULT_HOST = "https://airjam.co";
const UPLOADER_CONFIG_ENDPOINT = "/s/uploader?id=";
const UPLOAD_ENDPOINT = "/s/upload";
const REVERT_ENDPOINT = "/s/upload/delete/";
const DEFAULT_COMPONENT_NAME = "uploader";

interface States {
    files: any[];
    maxFiles: number; 
}

export interface UploaderProps {
    id: string;
    authToken?: string;
    host?: string;
    name?: string;
    uploaderName?: string;
    onRemove?: (removed: any[]) => any;
    onAdd?: (added: any[]) => any;
}

export default class Uploader extends React.Component<UploaderProps, States> {
    private _isMounted: boolean = false;

    constructor(props: UploaderProps) {
        super(props);
        this.state = {
            files: [],
            maxFiles: 0,
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchUploaderConfiguration();
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(prevProps: UploaderProps) {
        //todo, if id changes, then reload everything
    }

    render(): React.ReactElement<any> {
        const allowMultiple: boolean = (this.state.maxFiles !== 1);
        const maxFiles: number | null = this.state.maxFiles === 0 ? null : this.state.maxFiles;
        const host: string = this.props.host ? this.props.host : DEFAULT_HOST;
        return <div style={{width: "100%"}}>
            <FilePond
                allowMultiple={allowMultiple}
                maxFiles={maxFiles}
                allowRevert={true}
                credits={false}
                name={this.props.name ? this.props.name : DEFAULT_COMPONENT_NAME}
                server={{
                        url: host,
                        timeout: 7000,
                        process: {
                            url: UPLOAD_ENDPOINT,
                            method: 'POST',
                            headers: {
                                'Authorization': this.props.authToken,
                                'Access-Control-Allow-Origin': '*',
                            },
                            withCredentials: false,
                            onload: (response) => {
                                const respJson = JSON.parse(response);
                                if (respJson.files && respJson.files.length > 0) {
                                    const newFileSet = [...this.state.files, ...respJson.files];
                                    const urls = respJson.files.map((file: any) => { return file.url });
                                    this.setState({files: newFileSet});
                                    if (this.props.onAdd) this.props.onAdd(respJson.files);
                                    return urls.join(",");
                                }
                                return "";
                            },
                            ondata: (formData) => {
                                formData.append('id', this.props.id);
                                formData.append('authToken', this.props.authToken);
                                formData.append('uploaderName', this.props.uploaderName ? this.props.uploaderName : '');
                                return formData;
                            }},
                        revert: {
                            url: REVERT_ENDPOINT,
                            method: 'GET',
                            headers: {
                                'Authorization': this.props.authToken,
                                'Access-Control-Allow-Origin': '*',
                            },
                            ondata: (formData) => {
                                console.log(formData);
                                formData.append('id', this.props.id);
                                formData.append('idToken', this.props.authToken);
                                formData.append('uploaderName', this.props.uploaderName ? this.props.uploaderName : '');
                                return formData;
                            },
                        },
                        }}
                onremovefile={(err: any, file: any) => {
                    if (err) {
                        console.log("Error occurred while removing a file.");
                        console.log(err);
                    }
                    this.removeFile(file.filename);
                }}
            />
            <input type="hidden" name={"files-" + this.props.id} value={this.currentUploadedFiles()}/>
        </div>;
    }

    private currentUploadedFiles() {
        return JSON.stringify(this.state.files);
    }

    private removeFile(filename: string) {
        const removingFiles = [];
        const newFileSet = this.state.files.filter((file: any) => {
            if (file.url && file.url.includes(filename)) {
                removingFiles.push(file);
                return false;
            }
            return true;
        });
        if (this.props.onRemove) this.props.onRemove(removingFiles);
        this.setState({files: newFileSet});
    }

    private fetchUploaderConfiguration() {
        let hostUrl = this.props.host ? this.props.host : DEFAULT_HOST;
        hostUrl += UPLOADER_CONFIG_ENDPOINT + this.props.id;
        fetch(hostUrl).then((json) => {
            if (json && this._isMounted) {
                json.json().then((response: any) => {
                    console.log(response);
                    if (response && response.fileLimit) this.setState({ maxFiles: Number(response.fileLimit) });
                });
            }
        });
    }
}
