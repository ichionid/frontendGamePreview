import * as React from "react";
import { drupal } from "lib/drupal"
import { DrupalNode } from "next-drupal"
import Router from "next/router"

// https://www.carlrippon.com/building-super-simple-react-form-component-typescript-basics/
interface IFormProps {
    /* The http path that the form will be posted to */
    action: string;
}

export interface IValues {
    /* Key value pairs for all the field values with key being the field name */
    [key: string]: any;
}

export interface IErrors {
    /* The validation error messages for each field (key is the field name */
    [key: string]: string;
}

export interface IFormState {
    /* The field values */
    values: IValues;

    /* The field validation error messages */
    errors: IErrors;

    /* Whether the form has been successfully submitted */
    submitSuccess?: boolean;
}

export class FormGameReview extends React.Component<IFormProps, IFormState> {
    constructor(props: IFormProps) {
        super(props);

        const errors: IErrors = {};
        const values: IValues = {};
        this.state = {
            errors,
            values
        };
    }

    /**
     * Returns whether there are any errors in the errors object that is passed in
     * @param {IErrors} errors - The field errors
     */
    private haveErrors(errors: IErrors) {
        let haveError: boolean = false;
        Object.keys(errors).map((key: string) => {
            if (errors[key].length > 0) {
                haveError = true;
            }
        });
        return haveError;
    }

    /**
     * Handles form submission
     * @param {React.FormEvent<HTMLFormElement>} e - The form event
     */
    private handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        if (this.validateForm()) {
            const submitSuccess: boolean = await this.submitForm(e);
            if (submitSuccess) {
                Router.reload(window.location.pathname)
            }
            this.setState({ submitSuccess });
        }
    };

    /**
     * Executes the validation rules for all the fields on the form and sets the error state
     * @returns {boolean} - Whether the form is valid or not
     */
    private validateForm(): boolean {
        // TODO - validate form
        return true;
    }

    /**
     * Submits the form to the http api
     * @param {React.FormEvent<HTMLFormElement>} e - The form event
     * @returns {boolean} - Whether the form submission was successful or not
     */
    private async submitForm(e: React.FormEvent<HTMLFormElement>): Promise<boolean> {
        console.log(e.target.elements.title.value);
        console.log(e.target.elements.date.value);
        console.log(e.target.elements.mvpLink.value);
        console.log(e.target.elements.summary.value);

        const page = await drupal.createResource<DrupalNode>("node--page", {
            data: {
                attributes: {
                    title: "Page Title",
                    body: {
                        value: "<p>Content of body field</p>",
                    },
                },
            },
        }, {
            withAuth: {
                clientId: process.env.DRUPAL_CLIENT_ID,
                clientSecret: process.env.DRUPAL_CLIENT_SECRET,
            },
        },
        )
        const game = await drupal.createResource("node--game_review", {
            data: {
                attributes: {
                    title: e.target.elements.title.value,
                    body: {
                        value: e.target.elements.summary.value,
                    },
                },
            },
        }, {
            withAuth: {
                clientId: process.env.DRUPAL_CLIENT_ID,
                clientSecret: process.env.DRUPAL_CLIENT_SECRET,
            },
        },
        )
        // TODO - submit the form
        return true;
    }

    public render() {
        const { submitSuccess, errors } = this.state;
        return (
            <form onSubmit={this.handleSubmit} noValidate={true}>
                <div className="w-full max-w-lg">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Game title*:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label htmlFor="date">Date:</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label htmlFor="mvpLink">MVP link:</label>
                            <input
                                type="text"
                                id="mvpLink"
                                name="mvpLink"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label htmlFor="summary">Summary</label>

                            <textarea
                                id="summary"
                                rows="10"
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Write your thoughts"
                                name="summary"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={this.haveErrors(errors)}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                    {submitSuccess && (
                        <div className="alert alert-info" role="alert">
                            The game was successfully submitted!
                        </div>
                    )}
                    {submitSuccess === false &&
                        !this.haveErrors(errors) && (
                            <div className="alert alert-danger" role="alert">
                                Sorry, an unexpected error has occurred
                                by or Trongårdsskollen            </div>
                        )}
                    {submitSuccess === false &&
                        this.haveErrors(errors) && (
                            <div className="alert alert-danger" role="alert">
                                Sorry, the form is invalid. Please review, adjust and try again
                            </div>
                        )}
                </div>
            </form>
        );
    }
}
