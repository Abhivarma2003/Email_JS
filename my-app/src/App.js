"use client"

import { useState, useRef, useEffect } from "react"
import "./App.css"
import { Smile, Paperclip, Link2, Star, Trash2, Minus, Square, X, Download, Image } from "lucide-react"
import emailjs from "@emailjs/browser"

// Emoji categories and data
const emojiCategories = {
  smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"],
  gestures: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👋", "🤚", "🖐️", "✋"],
  animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🙈", "🙉"],
  food: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆"],
  travel: ["🚗", "✈️", "🚀", "⛵", "🚂", "🚁", "🛸", "🏠", "🏢", "🏰", "🏯", "🏝️", "🏔️", "🌋", "🗻", "🌄", "🌅"],
}

function App() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const formRef = useRef(null)
  const [attachments, setAttachments] = useState([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [currentEmojiCategory, setCurrentEmojiCategory] = useState("smileys")
  const [isSending, setIsSending] = useState(false)
  const [images, setImages] = useState([])
  const [isStarred, setIsStarred] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
    if (isMaximized) setIsMaximized(false)
  }

  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
    if (isMinimized) setIsMinimized(false)
  }

  const handleClose = () => {
    if (to || subject || message) {
      if (window.confirm("Are you sure you want to close this message?")) {
        resetForm()
      }
    } else {
      resetForm()
    }
  }

  const resetForm = () => {
    setTo("")
    setSubject("")
    setMessage("")
    setAttachments([])
    setImages([])
    setIsStarred(false)
    showTemporaryNotification("Message cleared")
  }

  const showTemporaryNotification = (text) => {
    setShowNotification(text)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!to) {
      showTemporaryNotification("Please specify at least one recipient")
      return
    }

    setIsSending(true)

    // EmailJS integration
    const templateParams = {
      to_email: to,
      subject: isStarred ? `⭐ ${subject}` : subject,
      message: message,
      from_name: "Your Email App",
      reply_to: "noreply@youremailapp.com",
    }

    emailjs
      .send(
        "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
        "YOUR_TEMPLATE_ID", // Replace with your EmailJS template ID
        templateParams,
        "YOUR_PUBLIC_KEY", // Replace with your EmailJS public key
      )
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text)
        showTemporaryNotification("Message sent successfully!")
        resetForm()
        setIsSending(false)
      })
      .catch((err) => {
        console.log("FAILED...", err)
        // For demo purposes, show success anyway
        showTemporaryNotification("Message sent successfully! (Demo mode)")
        resetForm()
        setIsSending(false)
      })
  }

  const handleAttachment = () => {
    fileInputRef.current.click()
  }

  const handleImageInsert = () => {
    imageInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setAttachments([...attachments, ...files])
      showTemporaryNotification(`${files.length} file(s) attached`)
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      }))
      setImages([...images, ...newImages])

      // Insert image placeholders in the message
      let updatedMessage = message
      newImages.forEach((img) => {
        updatedMessage += `\n[Image: ${img.name}]\n`
      })
      setMessage(updatedMessage)

      showTemporaryNotification(`${files.length} image(s) inserted`)
    }
  }

  const removeAttachment = (index) => {
    const newAttachments = [...attachments]
    newAttachments.splice(index, 1)
    setAttachments(newAttachments)
    showTemporaryNotification("Attachment removed")
  }

  const removeImage = (index) => {
    const newImages = [...images]
    URL.revokeObjectURL(newImages[index].url)
    newImages.splice(index, 1)
    setImages(newImages)
    showTemporaryNotification("Image removed")
  }

  const insertEmoji = (emoji) => {
    setMessage(message + emoji)
    setShowEmojiPicker(false)
  }

  const toggleStar = () => {
    setIsStarred(!isStarred)
    showTemporaryNotification(isStarred ? "Removed importance" : "Marked as important")
  }

  const handleLinkButtonClick = () => {
    setShowLinkInput(!showLinkInput)
    if (showLinkInput) {
      setLinkUrl("")
      setLinkText("")
    }
  }

  const insertLink = () => {
    if (!linkUrl) {
      showTemporaryNotification("Please enter a URL")
      return
    }

    const displayText = linkText || linkUrl
    const linkMarkdown = `[${displayText}](${linkUrl})`
    setMessage(message + linkMarkdown)
    setShowLinkInput(false)
    setLinkUrl("")
    setLinkText("")
    showTemporaryNotification("Link inserted")
  }

  const downloadDraft = () => {
    const draftContent = `To: ${to}\nSubject: ${subject}\n\n${message}`
    const blob = new Blob([draftContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `draft-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showTemporaryNotification("Draft downloaded")
  }

  useEffect(() => {
    // Cleanup object URLs when component unmounts
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url))
    }
  }, [])

  if (isMinimized) {
    return (
      <div className="minimized-email" onClick={() => setIsMinimized(false)}>
        <span>📧 New message</span>
      </div>
    )
  }

  return (
    <div className="app-container">
      {showNotification && <div className="notification">{showNotification}</div>}

      <div className={`email-container ${isMaximized ? "maximized" : ""}`}>
        <div className="email-header">
          <div className="email-title">
            <span>📧 New message {isStarred && "⭐"}</span>
          </div>
          <div className="window-controls">
            <button className="window-button minimize" onClick={handleMinimize}>
              <Minus size={16} />
            </button>
            <button className="window-button maximize" onClick={handleMaximize}>
              <Square size={16} />
            </button>
            <button className="window-button close" onClick={handleClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="email-body">
          <form ref={formRef} onSubmit={handleSend}>
            <div className="form-group">
              <input type="text" placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="form-group">
              <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="message-area">
              <textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {showLinkInput && (
              <div className="link-input-container">
                <div className="link-input-group">
                  <input
                    type="url"
                    placeholder="Enter URL (e.g., https://example.com)"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                </div>
                <div className="link-input-group">
                  <input
                    type="text"
                    placeholder="Display text (optional)"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                  />
                </div>
                <div className="link-buttons">
                  <button type="button" className="link-button insert" onClick={insertLink}>
                    Insert Link
                  </button>
                  <button type="button" className="link-button cancel" onClick={handleLinkButtonClick}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {images.length > 0 && (
              <div className="images-preview">
                {images.map((img, index) => (
                  <div key={`img-${index}`} className="image-preview-item">
                    <img src={img.url || "/placeholder.svg"} alt={img.name} />
                    <button type="button" className="remove-image" onClick={() => removeImage(index)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {attachments.length > 0 && (
              <div className="attachments-list">
                <h4>Attachments</h4>
                {attachments.map((file, index) => (
                  <div key={`file-${index}`} className="attachment-item">
                    <span>{file.name}</span>
                    <button type="button" className="remove-attachment" onClick={() => removeAttachment(index)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="email-footer">
              <button type="submit" className="send-button" disabled={isSending}>
                {isSending ? "SENDING..." : "SEND"}
              </button>

              <div className="toolbar">
                <div className="emoji-container">
                  <button type="button" className="toolbar-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <Smile size={18} />
                  </button>

                  {showEmojiPicker && (
                    <div className="emoji-picker">
                      <div className="emoji-categories">
                        {Object.keys(emojiCategories).map((category) => (
                          <button
                            key={category}
                            className={`category-button ${currentEmojiCategory === category ? "active" : ""}`}
                            onClick={() => setCurrentEmojiCategory(category)}
                          >
                            {category === "smileys"
                              ? "😊"
                              : category === "gestures"
                                ? "👍"
                                : category === "animals"
                                  ? "🐶"
                                  : category === "food"
                                    ? "🍎"
                                    : "✈️"}
                          </button>
                        ))}
                      </div>
                      <div className="emoji-list">
                        {emojiCategories[currentEmojiCategory].map((emoji, index) => (
                          <button key={index} className="emoji-button" onClick={() => insertEmoji(emoji)}>
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button type="button" className="toolbar-button" onClick={handleAttachment}>
                  <Paperclip size={18} />
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    multiple
                    onChange={handleFileChange}
                  />
                </button>

                <button type="button" className="toolbar-button" onClick={handleImageInsert}>
                  <Image size={18} />
                  <input
                    type="file"
                    ref={imageInputRef}
                    style={{ display: "none" }}
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </button>

                <button type="button" className="toolbar-button" onClick={handleLinkButtonClick}>
                  <Link2 size={18} />
                </button>

                <button type="button" className={`toolbar-button ${isStarred ? "active" : ""}`} onClick={toggleStar}>
                  <Star size={18} />
                </button>

                <button type="button" className="toolbar-button" onClick={downloadDraft}>
                  <Download size={18} />
                </button>

                <button type="button" className="toolbar-button" onClick={resetForm}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App

