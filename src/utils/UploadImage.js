import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const uploadImage = async (image) => {
  try {
    const formData = new FormData()
    formData.append("file", image) // backend के नाम से match करे

    const response = await Axios({
      ...SummaryApi.uploadImage,
      data: formData
    })

    // ✅ सिर्फ data return करो
    return response.data
  } catch (error) {
    console.error("Upload Image Error:", error)
    throw error
  }
}

export default uploadImage
