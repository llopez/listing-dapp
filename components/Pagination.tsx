import { useState } from "react"
import { Pagination } from "react-bootstrap"

interface I_Props {
  onChange: (page: number) => void
}

const Pager = (props: I_Props) => {
  const { onChange } = props

  const [page, setPage] = useState<number>(1)

  const handleFirst = () => {
    setPage(1)
    onChange(1)
  }

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
    <Pagination className="justify-content-center">
      <Pagination.First onClick={handleFirst} />
      <Pagination.Prev onClick={handlePrev} />
      <Pagination.Ellipsis />
      <Pagination.Item active>{page}</Pagination.Item>
      <Pagination.Ellipsis />
      <Pagination.Next onClick={handleNext} />
      <Pagination.Last />
    </Pagination>
  )
}

export default Pager