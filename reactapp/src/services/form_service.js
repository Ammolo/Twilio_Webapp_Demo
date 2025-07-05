import http from "../http-common";

/**
 * create_submission: form submit callback creator ; 
 * this function helps to create automatically an axios query to (post) send forms.
 * 
 * Warning: the action and method attributs of the form tag have to be defined.
 */
export default function create_submission(success_callback, error_callback, headers={})
{
    return (event) => {
        event.preventDefault();

        const form = event.target;

        // Fetch action, method and data
        const action = form.getAttribute("action"),
              method = form.getAttribute("method"),
              formData = new FormData(form);

        http[method](action, formData, headers)
            .then(success_callback)
            .catch(error_callback);
    }
}
