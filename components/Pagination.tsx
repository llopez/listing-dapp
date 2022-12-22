import { useState } from "react"

interface I_Props {
  onChange: (page: number) => void
}

const Pagination = (props: I_Props) => {
  const { onChange } = props

  const [page, setPage] = useState<number>(1)

  const handlePrev = () => {
    if (page <= 1) return
    const newPage = page - 1
    setPage(newPage)
    onChange(newPage)
  }

  const handleNext = () => {
    const newPage = page + 1
    setPage(newPage)
    onChange(newPage)
  }

  return (
    <div>
      <a onClick={handlePrev}>prev</a> | {page} | <a onClick={handleNext}>next</a>
    </div>
  )
}

export default Pagination