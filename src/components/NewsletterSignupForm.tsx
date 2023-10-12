import { FormEventHandler, useState } from "react"

interface Props {
  id: string
  title: string
  description: string
  submit: string
  statusSubmitting: string
  statusSuccess: string
  statusError: string
  includeName?: boolean
}
interface Values {
  email: string
  name?: string
}
enum Status {
  Initial,
  Submitting,
  Success,
  Error,
}

export const NewsletterSignupForm = ({
  id,
  title,
  description,
  submit,
  statusSubmitting,
  statusSuccess,
  statusError,
  includeName,
}: Props) => {
  const [values, setValues] = useState<Values>({ email: "" })
  const setValue = (key: keyof Values, value: string) => {
    setValues((values) => ({ ...values, [key]: value }))
  }

  const [status, setStatus] = useState<Status>(Status.Initial)

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    setStatus(Status.Submitting)

    let url = `https://assets.mailerlite.com/jsonp/622467/forms/${id}/subscribe`
    url = `${url}?fields[email]=${encodeURIComponent(values.email)}`
    if (includeName && values.name) {
      url = `${url}&fields[name]=${encodeURIComponent(values.name)}`
    }
    url = `${url}&ml-submit=1&anticsrf=true`

    fetch(url)
      .then((result) => result?.json())
      .then((body) => {
        if (body.success === true) {
          setStatus(Status.Success)
        } else {
          throw new Error()
        }
      })
      .catch(() => {
        setStatus(Status.Error)
      })
  }

  const describeStatus = () => {
    switch (status) {
      case Status.Submitting:
        return <p className="loading">{statusSubmitting}</p>
      case Status.Success:
        return <p className="success">{statusSuccess}</p>
      case Status.Error:
        return <p className="error">{statusError}</p>
      default:
        return null
    }
  }

  return (
    <div className="newsletter-signup-form">
      <div className="main-col text-styles">
        <h4>{title}</h4>
      </div>
      <div className="inner text-styles inverted">
        <div className="main-col">
          <p>{description}</p>
          {status !== Status.Success && (
            <form onSubmit={handleSubmit}>
              {includeName && (
                <input
                  aria-label="Name"
                  aria-required="true"
                  type="text"
                  data-inputmask=""
                  name="name"
                  placeholder="Name"
                  autoComplete="name"
                  onChange={(event) => setValue("name", event.target.value)}
                  disabled={status === Status.Submitting}
                />
              )}
              <input
                aria-label="E-Mail"
                aria-required="true"
                type="email"
                data-inputmask=""
                name="email"
                placeholder="E-Mail"
                autoComplete="email"
                onChange={(event) => setValue("email", event.target.value)}
                disabled={status === Status.Submitting}
              />
              <button type="submit" disabled={status === Status.Submitting}>
                {submit}
              </button>
            </form>
          )}
          {describeStatus()}
        </div>
      </div>
    </div>
  )
}
