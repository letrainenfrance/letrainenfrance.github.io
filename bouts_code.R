

library(shiny)

# Define UI for application that draws a histogram
ui <- fluidPage(
   
   # Application title
   titlePanel("Titre de la visualisation"),
   ###### Choix de l'utilisateur
   # Include clarifying text ----
   helpText("Note: while the data view will show only the specified",
            "number of observations, the summary will still be based",
            "on the full dataset."),
   
   # Input: actionButton() to defer the rendering of output ----
   # until the user explicitly clicks the button (rather than
   # doing it immediately when inputs change). This is useful if
   # the computations required to render output are inordinately
   # time-consuming.
   actionButton("update", "Update View"),
   
   # Un slider pour un input 
   sidebarLayout(
      sidebarPanel(
         sliderInput("bins",
                     "Number of bins:",
                     min = 1,
                     max = 50,
                     value = 30)
      ),
      
      ### Animations pour faire défiler plusieurs choix de l'utilisateur
      # Input: basic animation ----
      sliderInput("format", "Custom Format:",
                  min = 0, max = 10000,
                  value = 0, step = 2500,
                  pre = "$", sep = ",",
                  animate = TRUE),
      
      # Input: Animation with custom interval (in ms) ----
      # to control speed, plus looping
      sliderInput("animation", "Looping Animation:",
                  min = 1, max = 2000,
                  value = 1, step = 10,
                  animate =
                    animationOptions(interval = 300, loop = TRUE))
   )
)

    
# Bouton pour que l'utilisateur télécharge l'output
downloadButton("downloadData", "Download")
      # Show a plot of the generated distribution
      mainPanel(
         plotOutput("distPlot")
      )
   
##############################################################

######################

server <- function(input, output) {
   
  #################
  # Draw a histogram 
  # Reactive expression to create data frame of all input values ----
  sliderValues <- reactive({
    
    data.frame(
      Name = c("Integer",
               "Decimal",
               "Range",
               "Custom Format",
               "Animation"),
      Value = as.character(c(input$integer,
                             input$decimal,
                             paste(input$range, collapse = " "),
                             input$format,
                             input$animation)),
      stringsAsFactors = FALSE)
    
  }
  )
  #########################
   output$distPlot <- renderPlot({
      # generate bins based on input$bins from ui.R
      x    <- faithful[, 2] 
      bins <- seq(min(x), max(x), length.out = input$bins + 1)
      
      # draw the histogram with the specified number of bins
      hist(x, breaks = bins, col = 'darkgray', border = 'white')
   })
   
#################### 
   # Show the values in an HTML table ----
   output$values <- renderTable({
     sliderValues()
   })
}
      
############################################################
# Run the application 
shinyApp(ui = ui, server = server)

############################################################
############ HTML  #########################################      
# Generate an HTML table view of the head of the data ----
output$table <- renderTable({
head(data.frame(x = d()))
      })

# Create Shiny app ----
shinyApp(ui = htmlTemplate("www/index.html"), server)
