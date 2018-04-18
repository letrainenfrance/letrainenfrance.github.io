library(readxl)
library(ggplot2)
library(reshape)

data <- as.data.frame(read_excel("C:/Users/Alexandre/Downloads/selected_cities.xlsx"))
names(data)[1] <- "annee"

data[60,4] <- data[59,4]
data[60,2] <- NA

mydata <- melt(data, id=c("annee"))
names(mydata) <- c("annee","trajet","vitesse")

mydata$paris <- substr(mydata$trajet, 1, 5) == "PARIS"
mydata$vitesse <- as.numeric(as.character(mydata$vitesse))


for(i in as.numeric(data$annee)){
d1 <- subset(mydata,mydata$annee==i & !is.na(mydata$vitesse))
d1 <- d1[order(-d1$vitesse),]
d1$position <- 1:length(d1$annee)
if(sum(d1$paris)==length(d1$paris)){
  cbPalette <- c("#56B4E9")
} else {
  cbPalette <- c("#009E73","#56B4E9")
}

ggplot(data = d1 , aes(x=position, y=vitesse, fill=paris)) +
  geom_bar(stat = "identity", position=position_dodge()) + 
  theme(legend.position="none",
        axis.text.x = element_text(angle=45, vjust=1.2, hjust= 1 ),
        axis.ticks.x = element_blank(),
        panel.background = element_blank())+ 
  scale_x_discrete(limits = d1$trajet) +
  labs(title = paste ("Vitesse moyenne en", i , sep = " ", collapse = NULL) , subtitle = "En km/h")+
  xlab(" ") +  ylab(" ") +
  ylim(0,250)+
  scale_fill_manual(values=cbPalette)

ggsave(filename = paste ("Vitesse moyenne en", i , ".png", sep = " ", collapse = NULL), device = "png" , path = "C:/Users/Alexandre/Desktop/Vitesse Moyenne")

}  
